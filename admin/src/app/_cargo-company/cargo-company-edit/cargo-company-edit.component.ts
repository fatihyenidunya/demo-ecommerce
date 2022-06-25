import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoCompanyService } from '../cargo-company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { CargoCompany } from '../model/cargoCompany';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-cargo-company-edit',
  templateUrl: './cargo-company-edit.component.html',
  styleUrls: ['./cargo-company-edit.component.scss']
})
export class CargoCompanyEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;

  public picUrl;
  public info = '';
  public cargoCompany = new CargoCompany();
  counter: number;
  customId;
  header;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private cargoCompanyService: CargoCompanyService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.cargoCompanyService.moduleName;



  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.prepare(this.header);


    });

  }



  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.cargoCompanyService.deleted(this.customId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../admin/', this.thisModule]);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  prepare(header) {
    this.alertReset();
    this.counter = 3;
    this.customId = this.route.snapshot.params['id'];
    if (this.customId !== '0') {
      this.cargoCompanyService.getd(this.customId, header).subscribe((res: any) => {
        this.cargoCompany = res.cargoCompany;

      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

    } else {
      this.disable = false;
      this.cleanData();
    }
  }


  OnSubmit(form: NgForm) {


    const formData = new FormData();
    formData.append('company', this.cargoCompany.company);
    formData.append('officer', this.cargoCompany.officer);
    formData.append('phone', this.cargoCompany.phone);
    formData.append('mobil', this.cargoCompany.mobil);
    formData.append('email', this.cargoCompany.email);

    if (this.customId !== '0') {
      this.cargoCompanyService.updated(this.customId, formData, this.header)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    } else {
      this.cargoCompanyService.saved(formData, this.header)
        .subscribe((res: any) => {
          this.showInfo();

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    }
  }


  cleanData() {
    this.cargoCompany.company = '';
    this.cargoCompany.officer = '';
    this.cargoCompany.phone = '';
    this.cargoCompany.mobil = '';
    this.cargoCompany.email = '';

  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.cargoCompany.company + ' - ' + this.cargoCompany.officer, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.delete();
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  public showInfo() {
    if (this.isEdit === true) {
      this.alerts.push({
        type: 'info',
        message: 'The data has been updated',
      });
    } else {
      this.alerts.push({
        type: 'success',
        message: 'The data was saved succesfully',
      });
    }
    this.simpleTimer.newTimer('3sec', 1, false);
    this.simpleTimer.subscribe('3sec', () => this.callback());
  }


  private closeInfo() {
    if (this.isEdit === true) {
      this.alerts.splice(this.alerts.indexOf({
        type: 'info',
        message: 'The data has been updated',
      }), 1);
    } else {
      this.alerts.splice(this.alerts.indexOf({
        type: 'success',
        message: 'The data was saved succesfully',
      }), 1);
    }
  }

  alertClose(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  alertReset() {
    this.alerts = Array.from(ALERTS);
    this.counter = 0;
  }

  callback() {
    this.counter--;
    if (this.counter === 0) {
      this.simpleTimer.delTimer('3sec');
      if (this.isEdit === true) {
        this.router.navigate(['../../../', this.thisModule]);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }




}
