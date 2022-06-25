import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationProductionOrderDialogComponent } from './confirmation-production-order-dialog.component';

@Injectable()
export class ConfirmationProductionOrderDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    company: string,
    title: string,
    messageHead1: string,
    message1: string,
    messageHead2: string,
    message2: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationProductionOrderDialogComponent, { size: dialogSize });
    modalRef.componentInstance.company = company;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.messageHead1 = messageHead1;
    modalRef.componentInstance.message1 = message1;
    modalRef.componentInstance.messageHead2 = messageHead2;
    modalRef.componentInstance.message2 = message2;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
