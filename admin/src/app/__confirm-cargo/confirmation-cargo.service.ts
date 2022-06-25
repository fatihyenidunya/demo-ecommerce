import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationCargoComponent } from './confirmation-cargo.component';

@Injectable()
export class ConfirmationCargoService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    customer: string,
    cargoCompany: string,
    trackingCode: string,
    deliveryAddress,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationCargoComponent, { size: dialogSize });
    modalRef.componentInstance.customer = customer;
    modalRef.componentInstance.cargoCompany = cargoCompany;
    modalRef.componentInstance.trackingCode = trackingCode;
    modalRef.componentInstance.deliveryAddress = deliveryAddress;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
