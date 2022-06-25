import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { ProductService } from '../product.service';
import { CartService } from '../../_cart/cart.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { Product } from '../model/product';
import { Cart } from '../model/cart';
import { Comment } from '../model/comment';
import { NgForm } from '@angular/forms';
import { MessageService } from '../../message.service';
import { ToastrService } from 'ngx-toastr';

import { SearchLayoutService } from '../../__search-layout/search-layout.service';
import { AppComponent } from '../../app.component';


@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    navigationSubscription;
    nodejsApi;

    productId;
    product;
    productTitle;
    comments;
    category;
    cart;

    comment = new Comment();
    customerId;
    colors: any[];
    selectedColor;
    sizes: any[];
    selectedSize;
    discount = 0;
    productImage;

    listPrice;
    listPriceCurrency;
    salePrice;
    salePriceCurrency;
    volume;
    volumeEntity;

    selectedSalePrice;
    selectedStockCode;

    selectedVolume;
    selectedVolumeEntity;

    selectedCurrency;

    colorListPrice;
    colorListPriceCurrency;
    colorSalePrice;
    colorSalePriceCurrency;
    colorVolume;
    colorVolumeEntity;

    buttonTxt = "Sepete Ekle";
    buttonDisable = false;

    cartStockCode = '';
    cartOrderQuantity = 1;

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,
        public sanitizer: DomSanitizer,
        private titleService: Title,
        private metaService: Meta,
        private toastrService: ToastrService,
        private messageService: MessageService,
        private searchLayoutService: SearchLayoutService,
        private appComponent:AppComponent





    ) {

        this.nodejsApi = appConnections.nodejsApi;


        this.customerId = localStorage.getItem('customerId');



        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {


                this.productId = this.route.snapshot.params.id;
                this.appComponent.isChange = false;
                this.appComponent.isSubMenuChange = false;


                this.productId = this.productId.split('&')[1];
                // this.productTitle = this.route.snapshot.params.title;

                // this.getProductByTitle(this.productTitle);

                this.getProduct(this.productId);
                this.getComments(this.productId);
                this.comment.productId = this.productId;
                this.comment.customerId = this.customerId;



            }
        });


    }


    ngOnInit() {

        window.scrollTo(0, 0);



    }

    selectColor(color, stockCode) {



        if (color.stockCode !== stockCode) {

            if (this.product.colors.length !== 0) {

                this.listPrice = color.listPrice;
                this.listPriceCurrency = color.listPriceCurrency;
                this.salePrice = color.salePrice;
                this.salePriceCurrency = color.salePriceCurrency;
                this.volume = color.volume;
                this.volumeEntity = color.volumeEntity;

                this.discount = Math.floor(((this.listPrice - this.salePrice) / this.listPrice) * 100);

                this.selectedVolume = color.volume;
                this.selectedVolumeEntity = color.volumeEntity;
                this.selectedStockCode = color.stockCode;
                this.selectedSalePrice = color.salePrice;
                this.selectedCurrency = color.salePriceCurrency;

                this.product.orderQuantity = 1;
                this.buttonTxt = 'Sepete Ekle';
                this.buttonDisable = false;

            }

        }
        else {

            this.buttonTxt = 'Sepete Eklendi';
            this.buttonDisable = true;

            this.product.orderQuantity = this.cartOrderQuantity;

            this.listPrice = color.listPrice;
            this.listPriceCurrency = color.listPriceCurrency;
            this.salePrice = color.salePrice;
            this.salePriceCurrency = color.salePriceCurrency;
            this.volume = color.volume;
            this.volumeEntity = color.volumeEntity;

            this.discount = Math.floor(((this.listPrice - this.salePrice) / this.listPrice) * 100);

            this.selectedVolume = color.volume;
            this.selectedVolumeEntity = color.volumeEntity;
            this.selectedStockCode = color.stockCode;
            this.selectedSalePrice = color.salePrice;
            this.selectedCurrency = color.salePriceCurrency;

        }


        this.selectedColor = color;

    }

    selectSize(size, stockCode) {


        if (size.stockCode !== stockCode) {


            if (this.product.sizes.length !== 0) {

                this.listPrice = size.listPrice;
                this.listPriceCurrency = size.listPriceCurrency;
                this.salePrice = size.salePrice;
                this.salePriceCurrency = size.salePriceCurrency;
                this.volume = size.volume;
                this.volumeEntity = size.volumeEntity;

                this.discount = Math.floor(((this.listPrice - this.salePrice) / this.listPrice) * 100);

                this.selectedVolume = size.volume;
                this.selectedVolumeEntity = size.volumeEntity;
                this.selectedStockCode = size.stockCode;
                this.selectedSalePrice = size.salePrice;
                this.selectedCurrency = size.salePriceCurrency;
            }

            this.product.orderQuantity = 1;
            this.buttonTxt = 'Sepete Ekle';
            this.buttonDisable = false;

        } else {
            this.buttonTxt = 'Sepete Eklendi';
            this.buttonDisable = true;
            this.product.orderQuantity = this.cartOrderQuantity;

            this.listPrice = size.listPrice;
            this.listPriceCurrency = size.listPriceCurrency;
            this.salePrice = size.salePrice;
            this.salePriceCurrency = size.salePriceCurrency;
            this.volume = size.volume;
            this.volumeEntity = size.volumeEntity;

            this.discount = Math.floor(((this.listPrice - this.salePrice) / this.listPrice) * 100);

            this.selectedVolume = size.volume;
            this.selectedVolumeEntity = size.volumeEntity;
            this.selectedStockCode = size.stockCode;
            this.selectedSalePrice = size.salePrice;
            this.selectedCurrency = size.salePriceCurrency;


        }

        this.selectedSize = size;


    }


    getProduct(productId): void {

        this.productService.getForIndividualProduct('Turkey', this.productId).subscribe((res: any) => {
            this.product = res.product;
            this.category = res.category;
            this.messageService.sendDissmissSignal(true);


            if (this.product.sizes.length != 0) {
                this.sizes = this.product.sizes;
                this.listPrice = this.sizes[0].listPrice;
                this.listPriceCurrency = this.sizes[0].listPriceCurrency;
                this.salePrice = this.sizes[0].salePrice;
                this.salePriceCurrency = this.sizes[0].salePriceCurrency;
                this.volume = this.sizes[0].volume;
                this.volumeEntity = this.sizes[0].volumeEntity;
                this.selectedSize = this.sizes[0];


                this.selectedVolume = this.sizes[0].volume;
                this.selectedVolumeEntity = this.sizes[0].volumeEntity;
                this.selectedStockCode = this.sizes[0].stockCode;
                this.selectedSalePrice = this.sizes[0].salePrice;
                this.selectedCurrency = this.sizes[0].salePriceCurrency;

            }
            if (this.product.colors.length != 0) {


                this.colors = this.product.colors;
                this.listPrice = this.colors[0].listPrice;
                this.listPriceCurrency = this.colors[0].listPriceCurrency;
                this.salePrice = this.colors[0].salePrice;
                this.salePriceCurrency = this.colors[0].salePriceCurrency;
                this.volume = this.colors[0].volume;
                this.volumeEntity = this.colors[0].volumeEntity;
                this.selectedColor = this.colors[0];

                this.selectedVolume = this.colors[0].volume;
                this.selectedVolumeEntity = this.colors[0].volumeEntity;
                this.selectedStockCode = this.colors[0].stockCode;
                this.selectedSalePrice = this.colors[0].salePrice;
                this.selectedCurrency = this.colors[0].salePriceCurrency;
            }





            this.discount = Math.floor(((this.listPrice - this.salePrice) / this.listPrice) * 100);

            this.productImage = res.product.image[0];


            if (this.product.description === 'undefined') {

                this.product.description = '';
            }


            // if (this.salePrice !== this.listPrice) {

            //     this.discount = ((this.listPrice - this.salePrice) / this.listPrice) * 100;

            //     this.discount = Math.floor(this.discount);
            // }




            this.product.orderQuantity = 1;

            this.getCart();


            this.titleService.setTitle(this.product.title);
            this.metaService.updateTag(
                { name: 'description', content: this.product.metaDescription }
            );


        }, err => {

        });
    }

    showImage(i) {
        this.productImage = this.product.image[i];
    }


    getProductByTitle(title): void {

        this.productService.getProductByTitle(title).subscribe((res: any) => {
            this.product = res.product;
            this.product.orderQuantity = 0;
            console.log(this.product);
        }, err => {

        });
    }

    getComments(productId): void {

        this.productService.getComments(this.productId).subscribe((res: any) => {
            this.comments = res.comments;


        }, err => {

        });
    }


    up(product: Product) {


        product.orderQuantity++;
    }
    down(product: Product) {
        if (product.orderQuantity !== 0) {
            product.orderQuantity--;
        }
    }


    getCart(): void {

        this.cartService.getCart(this.customerId).subscribe((res: any) => {
            this.cart = res.cart;

            // alert(JSON.stringify(this.cart[0].stockCode) + ' ' + this.cart[0].unit + ' ' + this.cart[0].volume + ' ' + this.cart[0].volumeEntity)



            for (let _cart of this.cart) {

                if (this.product.colors.length != 0) {

                    let _color = this.colors.find(x => x.stockCode === _cart.stockCode);


                    if (_color != undefined) {

                        this.cartStockCode = _cart.stockCode;
                        this.cartOrderQuantity = _cart.unit;
                        this.selectColor(_color, this.cartStockCode);

                    }
                }




                if (this.product.sizes.length != 0) {


                    let _size = this.sizes.find(x => x.stockCode === _cart.stockCode);


                    if (_size != undefined) {

                        this.cartStockCode = _cart.stockCode;
                        this.cartOrderQuantity = _cart.unit;
                        this.selectSize(_size, this.cartStockCode);

                    }

                }



            }





        }, err => {
            // this.showError(err.error);
        });

    }

    addToCart(productId, productTitle, orderQuantity) {


        if (orderQuantity !== 0) {


            // this.cart.customerId = this.customerId;
            // this.cart.unitPrice = this.selectedSalePrice;
            // this.cart.currency = this.selectedCurrency;
            // this.cart.productId = productId;
            // this.cart.productTitle = productTitle;
            // this.cart.unit = orderQuantity;
            // this.cart.stockCode = this.selectedStockCode;
            // this.cart.color = this.selectedColor;
            //this.cart.totalPrice = orderQuantity * this.cart.unitPrice;



            // if (this.selectedSize !== 'undefined' && this.selectedSize !== '' && this.selectedSize !== undefined) {
            //     this.cart.size = this.selectedSize.size;
            // } else {
            //     this.cart.size = this.selectedVolume + this.selectedVolumeEntity;
            // }


            const formData = new FormData();
            formData.append('customer', this.customerId);
            formData.append('product', productId);
            formData.append('productTitle', productTitle);

            formData.append('unitPrice', String(this.selectedSalePrice));
            formData.append('unit', String(orderQuantity));
            formData.append('stockCode', this.selectedStockCode);
            formData.append('totalPrice', String((this.selectedSalePrice * orderQuantity).toFixed(2)));
            formData.append('currency', this.selectedCurrency);
            formData.append('country', 'Turkiye');
            formData.append('color', JSON.stringify(this.selectedColor));
            formData.append('volume', this.selectedVolume);
            formData.append('volumeEntity', this.selectedVolumeEntity);

            this.toastrService.success('Urun Sepete Eklendi', '', {
                timeOut: 2000
            });
            this.cartService.addToCart(formData).subscribe((res: any) => {


                this.messageService.sendMessage(res.productNumberInCart);

                this.getCart();


            },
                err => {
                    this.toastrService.warning('Urun Sepete Eklenemedi');

                });
        }
        else {


        }
    }



    OnSubmitComment(form: NgForm) {


        const formData = new FormData();
        formData.append('customerId', this.comment.customerId);
        formData.append('productId', this.comment.productId);
        formData.append('comment', this.comment.comment);
        formData.append('ranking', '0');



        // if (this.customerId !== '0') {
        // this.customService.updated(this.customId, formData)
        //     .subscribe((res: any) => {
        //         this.showInfo();
        //     }, err => {
        //         console.log('the error ' + JSON.stringify(err));
        //         this.showError(err);
        //     });
        // }

        // else {
        this.productService.postComment(formData)
            .subscribe((res: any) => {
                this.comment.comment = '';

            }, err => {

            });
        // }
    }


    // tslint:disable-next-line:use-lifecycle-interface
    ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we
        // don't then we will continue to run our initialiseInvites()
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }

    }

}
