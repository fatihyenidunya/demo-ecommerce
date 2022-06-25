import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderProductRetailerTransactionComponent } from './order-product-retailer-transaction.component';

@Injectable()
export class OrderProductRetailerTransactionService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    customer: string,
    orderId: string,
    productId: string,
    apiUrl: string,
    image: string,
    product: string,
    userId: string,
    operation: string,
    stockNumber: number,
    orderProductUnitNumber: number,
    readyProductUnitNumber: number,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(OrderProductRetailerTransactionComponent, { size: dialogSize });
    modalRef.componentInstance.customer = customer;
    modalRef.componentInstance.orderId = orderId;
    modalRef.componentInstance.productId = productId;
    modalRef.componentInstance.apiUrl = apiUrl;
    modalRef.componentInstance.image = image;
    modalRef.componentInstance.product = product;
    modalRef.componentInstance.userId = userId;
    modalRef.componentInstance.operation = operation;
    modalRef.componentInstance.stockNumber = stockNumber;
    modalRef.componentInstance.orderProductUnitNumber = orderProductUnitNumber;
    modalRef.componentInstance.readyProductUnitNumber = readyProductUnitNumber;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;



    return modalRef.result;
  }

}
