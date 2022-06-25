
import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppConnections } from '../app.connections';

@Component({
    selector: 'app-order-product-retailer-transaction',
    templateUrl: './order-product-retailer-transaction.component.html',
})
export class OrderProductRetailerTransactionComponent implements OnInit {
    @Input() customer: string;
    @Input() orderId: string;
    @Input() productId: string;
    @Input() apiUrl: string;
    @Input() image: string;
    @Input() product: string;
    @Input() userId: string;
    @Input() operation: string;
    @Input() stockNumber: number;
    @Input() orderProductUnitNumber: number;
    @Input() readyProductUnitNumber: number;
    @Input() btnOkText: string;
    @Input() btnCancelText: string;


    productUnitNumber = 0;
    mustHave = 0;

    disable = true;
    hideIt = true;
    showIt = true;

    operationName;
    imageApi;

    constructor(private activeModal: NgbActiveModal, private appConnections: AppConnections) {

        this.imageApi = appConnections.imageApi;

    }

    ngOnInit() {
        if (this.operation === 'Eklendi') {
            this.operationName = 'Ekle';
        }

        if (this.operation === 'Cikarildi') {
            this.operationName = 'Çıkar';
        }
    }

    public decline() {
        this.activeModal.close(false);
    }

    public accept() {



        this.mustHave = this.orderProductUnitNumber - this.readyProductUnitNumber;

        this.mustHave = this.mustHave;

        if (this.orderProductUnitNumber === 0) {
            this.mustHave = Number(this.productUnitNumber) + 1;
        }


        if (this.operation === 'Eklendi') {
            this.operationName = 'Ekle';
            if (this.productUnitNumber > this.stockNumber) {


                this.disable = false;
            } else {



                if ((Number(this.productUnitNumber) <= (Number(this.mustHave)))) {


                    this.appConnections.newProductUnitNumber = this.productUnitNumber;

                    this.disable = true;
                    this.showIt = true;
                    this.activeModal.close(true);

                } else {
                    this.showIt = false;
                }

            }
        }

        if (this.operation === 'Cikarildi') {
            this.operationName = 'Çıkar';



            if (this.orderProductUnitNumber >= this.productUnitNumber) {


                this.appConnections.newProductUnitNumber = this.productUnitNumber;
                this.hideIt = true;
                this.activeModal.close(true);
            } else {
                this.hideIt = false;
            }



        }


    }

    public dismiss() {
        this.activeModal.dismiss();
    }



}
