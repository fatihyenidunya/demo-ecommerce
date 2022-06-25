import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPaymentComponent } from './confirmation-payment.component';

@Injectable()
export class ConfirmationPaymentService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    cardNumber: string,
    grandTotal: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationPaymentComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.cardNumber = cardNumber;
    modalRef.componentInstance.grandTotal = grandTotal;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
