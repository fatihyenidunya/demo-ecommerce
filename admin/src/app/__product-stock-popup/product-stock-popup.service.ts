import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductStockPopupComponent } from './product-stock-popup-component';

@Injectable()
export class ProductStockPopupService {

    constructor(private modalService: NgbModal) { }

    public confirm(
        productId,
        productTitle,
        imageUrl,
        variable,
        stockCode,
        btnOkText: string = 'OK',
        btnCancelText: string = 'Cancel',
        dialogSize: 'sm' | 'lg' = 'lg'): Promise<boolean> {
        const modalRef = this.modalService.open(ProductStockPopupComponent, { size: dialogSize });

        modalRef.componentInstance.productId = productId;
        modalRef.componentInstance.imageUrl = imageUrl;
        modalRef.componentInstance.productTitle = productTitle;
        modalRef.componentInstance.variable = variable;
        modalRef.componentInstance.stockCode = stockCode;
        modalRef.componentInstance.btnOkText = btnOkText;
        modalRef.componentInstance.btnCancelText = btnCancelText;

        return modalRef.result;
    }

}
