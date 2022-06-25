
import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConnections } from '../app.connections';
import { ProductService } from '../_product/product.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
    selector: 'app-product-stock-popup',
    templateUrl: './product-stock-popup-component.html',
    styleUrls: ['./product-stock-popup.css']
})
export class ProductStockPopupComponent implements OnInit {


    @Input() productId;
    @Input() productTitle;
    @Input() imageUrl;
    @Input() variable;
    @Input() stockCode;

    message = '';
    public number;
    productStockNote;
    nodejsApi;
    imageApi;
    header;
    userName;
    math: any;

    constructor(private activeModal: NgbActiveModal,
        private appConnections: AppConnections,
        private ngxIndexedDBService: NgxIndexedDBService,
        private productService: ProductService) {

        this.math = Math;
        this.nodejsApi = appConnections.nodejsApi;
        this.imageApi = appConnections.imageApi;




    }

    ngOnInit() {

        this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

            this.header = user.oUserToken;
            this.userName = user.oUserName;


        });
    }

    public decline() {
        this.activeModal.close(false);

    }

    public accept() {


        this.activeModal.close(false);



    }

    public dismiss() {
        this.activeModal.close(false);

    }



    public updateStock(productId, number, operation) {

        let _variable;

        if (this.variable.color) {
            _variable = this.variable.color;
        }

        if (!this.variable.color) {
            _variable = this.variable.volume;

        }




        const data = {
            productId: productId,
            variable: _variable,
            stockCode: this.stockCode,
            number: number,
            operation: operation,
            userName: this.userName,
            productStockNote: this.productStockNote

        };




        this.productService.updateStock(productId, data, this.header).subscribe((res: any) => {


            if (res.closed === true) {
                this.activeModal.close(false);
            }

            this.message = res.message;


        }, err => {

        });



    }

}
