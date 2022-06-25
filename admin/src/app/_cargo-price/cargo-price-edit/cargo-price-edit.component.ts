import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CargoPriceService } from '../cargo-price.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { CargoPrice } from '../model/cargoPrice';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CargoCompanyService } from '../../_cargo-company/cargo-company.service';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-cargo-price-edit',
  templateUrl: './cargo-price-edit.component.html',
  styleUrls: ['./cargo-price-edit.component.scss']
})
export class CargoPriceEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;

  public picUrl;
  public info = '';
  public cargoPrice = new CargoPrice();
  counter: number;
  customId;
  header;
  statuses;

  cargoCompany;
  selectedCargoCompany;
  cargoCompanies;
  types;
  selectedType;
  currencies;
  selectedCurrency;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private cargoPriceService: CargoPriceService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService,
    private cargoCompanyService: CargoCompanyService

  ) {



    this.thisModule = this.cargoPriceService.moduleName;



  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {


      this.currencies = this.appConnections.currencies;

      this.header = user.oUserToken;
      this.getCargoCompanies();
      this.prepare(this.header);
      this.types = JSON.parse('[{"type":"' + this.appConnections.Percantage + '"},{"type":"' + this.appConnections.Amount + '"},{"type": "' + this.appConnections.FreeCargo + '"}]');




    });

  }

  selectType(tip) {

    this.cargoPrice.type = tip;
  }

  selectCurrency(currency) {


    this.cargoPrice.currency = currency;

  }


  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.cargoPriceService.deleted(this.customId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../','cargo-price']);
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
      this.cargoPriceService.getd(this.customId, header).subscribe((res: any) => {
        this.cargoPrice = res.cargoPrice;
        this.selectedCurrency = res.cargoPrice.currency;
        this.selectedCargoCompany = res.cargoPrice.company;
        this.selectedType = res.cargoPrice.type;

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
    formData.append('company', this.cargoPrice.company);
    formData.append('type', this.cargoPrice.type);
    formData.append('price', String(this.cargoPrice.price));
    formData.append('subLimit', String(this.cargoPrice.subLimit));
    formData.append('limit', String(this.cargoPrice.limit));
    formData.append('currency', this.cargoPrice.currency);

    if (this.customId !== '0') {
      this.cargoPriceService.updated(this.customId, formData, this.header)
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
      this.cargoPriceService.saved(formData, this.header)
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


  getCargoCompanies(): void {

    this.cargoCompanyService.getsd(this.header).subscribe((res: any) => {
      this.cargoCompanies = res.cargoCompanies;
      this.selectedCargoCompany = res.cargoCompanies[0].company;


    }, err => {
      this.showError(err.error);
    });


  }

  cleanData() {
    this.cargoPrice.company = '';

    this.cargoPrice.company = '';
    this.cargoPrice.type = '';
    this.cargoPrice.price = 0;
    this.cargoPrice.subLimit = 0;
    this.cargoPrice.limit = 0;
    this.cargoPrice.currency = '';


  }


  selectCargoCompany(selected) {
    this.cargoPrice.company = selected;
    this.selectedCargoCompany = selected;


  }

  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.cargoPrice.company + ' - ' + this.cargoPrice.limit, 'Do you really want to delete it ?')
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
        this.router.navigate(['../../../','cargo-price']);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }




}
