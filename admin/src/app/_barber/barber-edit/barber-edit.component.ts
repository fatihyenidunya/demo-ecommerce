import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarberService } from '../barber.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Barber } from '../model/barber';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { SmsComponent } from '../../sms.component';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-barber-edit',
  templateUrl: './barber-edit.component.html',
  styleUrls: ['./barber-edit.component.scss']
})
export class BarberEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;

  public totalRecord = 0;
  public pageNumber = 1;
  public pageSize = 30;
  activate = false;
  mailSended = false;

  infoPage = false;
  documentPage = true;
  documentBtn = false;
  infoBtn = true;

  public picUrl;
  public info = '';
  public barber = new Barber();
  counter: number;
  barberId;
  header;

  smsSetting;
  netGsmSmsId = '';
  netGsmSmsSucess = false;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  nodeJsApi;


  sms = {
    gsmNo: '',
    customer: '',
    message: '',
    messageFor: '',
    status: '',
    success: false
  }


  constructor(private barberService: BarberService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService,
    private smsComponent: SmsComponent



  ) {



    this.thisModule = this.barberService.moduleName;
    this.nodeJsApi = this.appConnections.nodejsApi;



  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.prepare(this.header);




    });

  }

  onInfoPage() {
    this.infoPage = false;
    this.documentPage = true;
    this.infoBtn = true;
    this.documentBtn = false;

  }



  onDocumentPage() {
    this.infoPage = true;
    this.documentPage = false;
    this.infoBtn = false;
    this.documentBtn = true;

  }


  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.barberService.deleted(this.barberId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../', this.thisModule]);
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
    this.barberId = this.route.snapshot.params['id'];
    if (this.barberId !== '0') {
      this.barberService.getd(this.barberId, header).subscribe((res: any) => {
        this.barber = res.barber;
        this.activate = res.barber.active;
        this.mailSended = res.barber.mailSended;





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
    formData.append('name', String(this.barber.name));
    formData.append('surname', String(this.barber.surname));
    formData.append('company', String(this.barber.company));
    formData.append('phone', String(this.barber.phone));
    formData.append('email', String(this.barber.email));
    formData.append('password', String(this.barber.password));
    formData.append('openAddress', this.barber.openAddress);
    formData.append('ip', String(this.barber.ip));
    formData.append('active', String(this.barber.active));
    formData.append('tcId', this.barber.tcId);
    formData.append('taxPlace', this.barber.taxPlace);
    formData.append('taxNo', this.barber.taxNo);

    if (this.barberId !== '0') {
      this.barberService.updated(this.barberId, formData, this.header)
        .subscribe((res: any) => {
          this.disable = true;
          this.activate = res.barber.active;
          this.mailSended = res.barber.mailSended;

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    } else {
      this.barberService.saved(formData, this.header)
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


  SendActivateMail() {


    this.barberService.getSendPricePdfToBarber(this.barberId, this.barber.active, this.header)
      .subscribe((res: any) => {
        this.activate = res.barber.mailSended;
        this.mailSendedConfirm(' Müşteri : ' + this.barber.name + ' ' + this.barber.surname + ' - BerBer Ünvanı : ' + this.barber.company, this.barber.email + ' adresine mail iletilmiştir.');
      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {

          this.mailSendedConfirm(JSON.stringify(err), ' beklenmeyen HATA!!!')
        }
      });

  }





  cleanData() {
    this.barber.active = false;

  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.barber.name + ' ' + this.barber.surname, 'Kaydı silmek istediğinden eminmisin ?')
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

  public showInfo2() {
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
    this.simpleTimer.subscribe('3sec', () => this.callback2());
  }



  sendSMS() {

    this.smsComponent.sendSMS(this.barber.name + ' ' + this.barber.surname, this.barber.phone, this.smsComponent.smsMemberApprovedMessage, this.smsComponent.smsMemberApprovedFor);
  }


  public mailSendedConfirm(message1, message2) {

    this.confirmationService.confirm(message1, message2)
      .then((confirmed) => {

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
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

  callback2() {
    this.counter--;
    if (this.counter === 0) {
      this.simpleTimer.delTimer('3sec');
      if (this.isEdit === true) {

      } else {
        this.alertReset();

      }
    }
  }



}
