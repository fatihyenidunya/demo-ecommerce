import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from './message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SmsService } from './_sms/sms.service';
import { NgbdModalContent } from './__server-error/server-error.component';
import { ConfirmationDialogService } from './__confirm/confirmation-dialog.service';

@Injectable()
export class SmsComponent {


  public nodejsApi;
  header;
  netGsmSmsId = '';
  netGsmSmsSucess = false;
  smsSetting;

  sms = {
    gsmNo: '',
    customer: '',
    message: '',
    messageFor: '',
    status: '',
    success: false
  }

  // netGsmApi = 'https://api.netgsm.com.tr/sms/send/get/?';
  // netGsmUserCode = '8503078888';
  // netGsmPassword = 'aslnkt34';
  // netGsmMsgHeader = 'ASIL GROUP';


  smsMemberApprovedMessage = 'Nishman üyeliğiniz onaylanmıştır. Nishman ürünlerinin bayii alış ve satış fiyatlarının olduğu PDF dosyası mailinize gönderilmiştir.';
  smsMemberApprovedFor = 'Uyelik Aktivasyon Bildirimi';

  smsOrderApprovedMessage = ' Referans kodlu siparişiniz onaylanmıştır.';
  smsOrderApprovedFor = 'Sipariş Onay Bildirimi';

  smsOrderShippedMessage = ' Referans kodlu siparişiniz size ulaştırılmak üzere kargoya verilmiştir. ';
  smsOrderShippedFor = 'Sipariş Gönderim Bildirimi';


  constructor(private httpClient: HttpClient, private confirmationService: ConfirmationDialogService, private router: Router, private modalService: NgbModal, private smsService: SmsService, private ngxIndexedDBService: NgxIndexedDBService, private messageService: MessageService) {



    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.getSmsSetting();

    });


  }


  getSmsSetting(): void {

    this.smsService.getSmsSettings(this.header).subscribe((res: any) => {
      this.smsSetting = res.smsSettings[0];

    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  sendSMS(customer, phone, smsMessage, smsFor) {




    this.sms.gsmNo = phone;
    this.sms.customer = customer;
    this.sms.message = smsMessage;
    this.sms.messageFor = smsFor;

    let _status = '';


    this.smsService.getSendActivationSmsByNetGSM(this.smsSetting.api, this.smsSetting.userCode, this.smsSetting.password, this.sms.gsmNo.replace('0', ''), this.sms.message, this.smsSetting.msgHeader)
      .subscribe((res: any) => {


        if (res == "20") {

          _status = 'Maximum karakter Sayısını geçtiniz';

        }

        if (res == "30") {

          _status = 'SMS hizmeti aldığınız firma için kullanıcı adı veya şifre hatalı yada kullanıcının Api erişim yetkisi yok';

        }
        if (res == "40") {

          _status = 'Message Başlığınız Sistemde Kayıtlı değildir.';

        }

        if (res == "85") {

          _status = 'Aynı numaraya bir 1 dakika içerisinde 20 den fazla sms gönderemezsiniz';

        }



        this.saveSms(_status + ' Hata Kodu = ' + res, false);


      }, err => {

        this.netGsmSmsId = JSON.stringify(err.error.text.split(' ')[1]);


        if (this.netGsmSmsId != '') {

          this.netGsmSmsSucess = true;
          this.smsInfo(customer, phone + ' numaraya ' + smsFor + ' iletilmiştir.');
        }
        this.saveSms(this.netGsmSmsId.replace('\"', '').replace('\"', ''), this.netGsmSmsSucess);


      });

  }


  saveSms(status, success) {




    const formData = new FormData();
    formData.append('gsmNo', this.sms.gsmNo);
    formData.append('customer', this.sms.customer);
    formData.append('message', this.sms.message);
    formData.append('messageFor', this.sms.messageFor);
    formData.append('status', status);
    formData.append('success', String(success));




    this.smsService.postNewSms(formData, this.header)
      .subscribe((res: any) => {



      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {


        } else {
          alert(JSON.stringify(err));
        }
      });

  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public smsInfo(customer, message) {

    this.confirmationService.confirm(customer, message)
      .then((confirmed) => {

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
