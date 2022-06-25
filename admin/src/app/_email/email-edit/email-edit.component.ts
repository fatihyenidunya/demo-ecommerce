import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../email.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Email } from '../model/email';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-email-edit',
  templateUrl: './email-edit.component.html',
  styleUrls: ['./email-edit.component.scss']
})
export class EmailEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  thisModule;
  public email = new Email();
  counter: number;
  emailId;


  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  header;

  constructor(private emailService: EmailService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiConnections: AppConnections,
    private ngxIndexedDBService: NgxIndexedDBService,
    private simpleTimer: SimpleTimer,
    private confirmationService: ConfirmationDialogService

  ) {






  }

  ngOnInit() {

    this.thisModule = this.emailService.moduleName;
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

    this.emailService.delete(this.emailId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../', this.thisModule]);
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
    this.emailId = this.route.snapshot.params['id'];
    if (this.emailId !== '0') {
      this.emailService.get(this.emailId, header).subscribe((res: any) => {
        this.email = res.email;

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

    if (this.emailId !== '5fdf87c3dc554637c49ca415') {
      formData.append('owner', this.email.owner);
    } else {
      formData.append('owner', 'noreply');
    }

    formData.append('smtp', this.email.smtp);
    formData.append('port', String(this.email.port));
    formData.append('secure', String(this.email.secure));
    formData.append('userName', this.email.userName);
    formData.append('password', this.email.password);

    if (this.emailId !== '0') {
      this.emailService.update(this.emailId, formData, this.header)
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
      this.emailService.save(formData, this.header)
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
    this.email.owner = '';
    this.email.smtp = '';
    this.email.port = 0;
    this.email.secure = true;
    this.email.userName = '';
    this.email.password = '';
  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.email.owner + ' - ' + this.email.userName, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {

          if (this.emailId !== '5fdf87c3dc554637c49ca415') {
            this.delete();
          } else {

          }

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
