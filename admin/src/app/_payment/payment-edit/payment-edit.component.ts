import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../payment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';

import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.scss']
})
export class PaymentEditComponent implements OnInit {

  public thisModule;
  nodejsApi;
  errorMessage;

  paymentId;
  header;
  payment: any;
  basketItems: any;

  constructor(private paymentService: PaymentService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private ngxIndexedDBService: NgxIndexedDBService,
    public domSanitizer: DomSanitizer,
    private confirmationDialogService: ConfirmationDialogService

  ) {



    this.thisModule = this.paymentService.moduleName;

    this.nodejsApi = appConnections.nodejsApi;



  }

  ngOnInit() {


    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.prepare(this.header);

    });


  }







  prepare(header) {


    this.paymentId = this.route.snapshot.params['id'];

    this.paymentService.getPayment(this.paymentId, header).subscribe((res: any) => {
      this.payment = res.payment;
      this.basketItems = res.payment.basketItems;
      this.errorMessage = res.payment.errorMessage;
      console.log(this.payment);

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(err);
      }
    });


  }


  cancel() {
    this.paymentService.getIPAddress().subscribe((res: any) => {


      const formData = new FormData();
      formData.append('locale', 'TR');
      formData.append('conversationId', this.payment.sale.conversationId);
      formData.append('iyzicoPaymentId', this.payment.sale.paymentId);
      formData.append('ip', res.ip);
      formData.append('paymentId', this.payment._id);
      formData.append('orderId', this.payment.orderId);


      this.paymentService.makeCancelFromIyzico(formData).subscribe((result: any) => {


        this.prepare(this.header);



      }, err => {
      });

    });
  }


  public confirmToRefund(price, paymentTransactionId, orderId, productId, itemName, itemVolume, itemVolumeEntity, paymentBuyerName, paymentBuyeSurname, currency) {

    let volume;

    if (itemVolumeEntity != 'Not') {
      volume = itemVolume + ' ' + itemVolumeEntity;
    }
    else {

      volume = itemVolume;
    }




    this.confirmationDialogService.confirm('Müşteri : '+paymentBuyerName + ' ' + paymentBuyeSurname + ' iade işlemini onaylıyormusunuz ?', itemName + ' ' + volume + ' - ' + price + ' ' + currency )
      .then((confirmed) => {
        if (confirmed === true) {
          this.refund(price, paymentTransactionId, orderId, productId);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  refund(price, paymentTransactionId, orderId, productId) {
    this.paymentService.getIPAddress().subscribe((res: any) => {
      const formData = new FormData();


      formData.append('ip', res.ip);
      formData.append('price', price);
      formData.append('paymentTransactionId', paymentTransactionId);
      formData.append('locale', 'TR');
      formData.append('conversationId', this.payment.sale.conversationId);
      formData.append('paymentId', this.paymentId);
      formData.append('orderId', orderId);
      formData.append('productId', productId);



      this.paymentService.makeRefundFromIyzico(formData).subscribe((result: any) => {


        this.prepare(this.header);



      }, err => {
      });
    });
  }

  OnSubmit(form: NgForm) {




  }





  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }












}
