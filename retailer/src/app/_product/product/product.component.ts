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

    cart;

    comment = new Comment();
    customerId;
    colors: string[] = [];
    selectedColor;
    sizes: any[];
    selectedSize;
    discount = 0;
    productImage;

    listPrice;
    salePrice;

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
       



    ) {

        this.nodejsApi = appConnections.nodejsApi;


        this.customerId = localStorage.getItem('customerId');

        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {

                this.productId = this.route.snapshot.params.id;

              
              

                this.productId = this.productId.split('&')[1];
                // this.productTitle = this.route.snapshot.params.title;

                // this.getProductByTitle(this.productTitle);

                this.getProduct(this.productId);
                this.getComments(this.product._id);
                this.comment.productId = this.product._id;
                this.comment.customerId = this.product._id;




            }
        });


    }


    ngOnInit() {

      
        window.scrollTo(0, 0);



    }

    selectColor(color) {
        this.selectedColor = color;
    }

    selectSize(size) {

        if (this.product.sizes.length !== 0) {

            this.listPrice = size.listPrice;
            this.salePrice = size.salePrice;
            this.discount = Math.floor(((this.listPrice - this.salePrice) / this.listPrice) * 100);

        }

        this.selectedSize = size;
    }


    getProduct(productId): void {

        this.productService.getForIndividualProduct('Turkey', this.productId).subscribe((res: any) => {
            this.product = res.product;
            console.log(this.product);
            this.productImage = res.product.productId.image[0];

         

            console.log(this.product);
            if (res.product.color !== 'undefined' && res.product.color !== '' && res.product.color !== undefined) {

                for (const c of res.product.color.split(',')) {

                    this.colors.push(c);
                }


                this.colors.push('Renk Seçiniz');
                this.selectedColor = 'Renk Seçiniz';

            }


            if (res.product.sizes.length !== 0) {

                this.sizes = res.product.sizes;


                // const size = {

                //     size: 'Size Seçiniz',
                //     listPrice: 0,
                //     salePrice: 0
                // };
                // this.sizes.push(size);
                // this.selectedSize = size;

                this.selectedSize = this.sizes[0];
                this.listPrice = this.sizes[0].listPrice;
                this.salePrice = this.sizes[0].salePrice;

            } else {


                if (res.product.size !== 'undefined' && res.product.size !== '' && res.product.size !== undefined) {

                    this.sizes = [];
                    for (const s of res.product.size.split(',')) {
                        const size = {
                            size: s
                        };
                        this.sizes.push(size);
                    }

                    this.selectedSize = this.sizes[0];
                    this.listPrice = res.product.listPrice;
                    this.salePrice = res.product.salePrice;

                } else {
                    this.listPrice = res.product.listPrice;
                    this.salePrice = res.product.salePrice;


                }


            }




            if (this.salePrice !== this.listPrice) {

                this.discount = ((this.listPrice - this.salePrice) / this.listPrice) * 100;

                this.discount = Math.floor(this.discount);
            }

            this.product.orderQuantity = 1;


            this.titleService.setTitle(this.product.turkishTitle);
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

    addToCart(productId,productTitle, orderQuantity, unitPrice, currency, volume, volumeEntity) {

        alert(productId)



        if (orderQuantity !== 0) {

            // this.cart.customerId = this.customerId;
            // this.cart.unitPrice = unitPrice;
            // this.cart.currency = currency;
            // this.cart.productId = productId;
            // this.cart.productTitle = productTitle;
            // this.cart.unit = orderQuantity;
            // this.cart.stockCode = stockCode;
            // this.cart.color = color;
            // this.cart.totalPrice = orderQuantity * this.cart.unitPrice;



            if (this.selectedSize !== 'undefined' && this.selectedSize !== '' && this.selectedSize !== undefined) {
                this.cart.size = this.selectedSize.size;
            } else {
                this.cart.size = volume + volumeEntity;
            }


            const formData = new FormData();
            formData.append('customer', this.cart.customerId);
            formData.append('product', this.cart.productId);
            formData.append('productTitle', this.cart.productTitle);
            formData.append('unitPrice', String(this.cart.unitPrice));
            formData.append('unit', String(orderQuantity));
            formData.append('stockCode', this.cart.stockCode);
            formData.append('totalPrice', String(this.cart.totalPrice));
            formData.append('currency', this.cart.currency);
            formData.append('country', 'Turkiye');
            formData.append('color', this.cart.color);
            formData.append('volume', volume);
            formData.append('volumeEntity', volumeEntity);

            this.toastrService.success('Urun Sepete Eklendi', '', {
                timeOut: 2000
            });
            this.cartService.addToCart(formData).subscribe((res: any) => {


                this.messageService.sendMessage(res.productNumberInCart);


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
