import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { HomeService } from '../home.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from '../../_product/model/product';
import { Cart } from '../../_product/model/cart';
import { CartService } from '../../_cart/cart.service';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import * as jQuery from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../message.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    sliders: any;
    nodejsApi;
    general: any;
    productLatests = [];
    afterShaved;
    spiderWax;
    discWax;
    faceCleanerMask;
    articles;
    videos;
    sanitizer;
    latestDiscount = 0;
    cart;
    customerId;
    hide: boolean[] = [];
    mainpageCategories;

    sizes;
    colors;
    paused = false;
    unpauseOnArrow = false;
    pauseOnIndicator = false;
    pauseOnHover = true;
    pauseOnFocus = true;

    hideForMobile = true;
    lastIndex = 0;

    @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

    constructor(
        private homeService: HomeService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,
        public domSanitizer: DomSanitizer,

        private cartService: CartService,
        private toastrService: ToastrService,
        private messageService: MessageService

    ) {

        this.nodejsApi = appConnections.nodejsApi;
        this.sanitizer = domSanitizer;
        this.general = appConnections.general;








    }


    ngOnInit() {
        this.customerId = localStorage.getItem('customerId');



        this.getSliders();
        this.getProductLatest('Turkey');
        // this.getCategoryProducts();
        this.getMainPageBlog();
        this.getMainPageVideo();

        this.getMainpageCategories();




        this.lastIndex = jQuery('.thumbs_style').last().index();

        // this.toastr.success('howdy');


    }


    getSliders(): void {

        this.homeService.getSliders().subscribe((res: any) => {
            this.sliders = res.sliders;


        }, err => {
            //this.showError(err.error);
        });
    }
    getProductLatest(country): void {

        this.homeService.getProductLatest(country).subscribe((res: any) => {

            this.productLatests = res.products;


            console.log(this.productLatests);

            for (const array of this.productLatests) {
                for (const product of array) {
                    // tslint:disable-next-line:max-line-length


                    this.sizes = product.sizes;
                    this.colors = product.colors;

                    if (product.colors.length != 0) {

                        product.discount = ((product.colors[0].listPrice - product.colors[0].salePrice) / product.colors[0].listPrice) * 100;
                    }

                    if (product.sizes.length != 0) {

                        product.discount = ((product.sizes[0].listPrice - product.sizes[0].salePrice) / product.sizes[0].listPrice) * 100;
                    }


                    product.discount = Math.floor(product.discount);
                    product.orderQuantity = 1;



                }
            }

            this.getCart();


        }, err => {
            //this.showError(err.error);
        });
    }

    addToCart(productId, productTitle, orderQuantity, stockCode, salePrice, currency, color, volume, volumeEntity) {



        if (orderQuantity !== 0) {

            this.cart.customerId = this.customerId;
            this.cart.unitPrice = salePrice;
            this.cart.currency = currency;
            this.cart.productId = productId;
            this.cart.productTitle = productTitle;
            this.cart.unit = orderQuantity;
            this.cart.stockCode = stockCode;
            this.cart.color = color;
            // this.cart.totalPrice = orderQuantity * this.cart.unitPrice;





            // if (this.selectedSize !== 'undefined' && this.selectedSize !== '' && this.selectedSize !== undefined) {
            //     this.cart.size = this.selectedSize.size;
            // } else {
            //     this.cart.size = volume + volumeEntity;
            // }


            const formData = new FormData();
            formData.append('customer', this.cart.customerId);
            formData.append('product', this.cart.productId);
            formData.append('productTitle', this.cart.productTitle);
            formData.append('unitPrice', String(this.cart.unitPrice));
            formData.append('unit', String(orderQuantity));
            formData.append('stockCode', this.cart.stockCode);
            formData.append('totalPrice', String((this.cart.unitPrice * orderQuantity).toFixed(2)));
            formData.append('currency', this.cart.currency);
            formData.append('country', 'Turkiye');
            formData.append('color', this.cart.color);
            formData.append('volume', volume);
            formData.append('volumeEntity', volumeEntity);


            this.cartService.addToCart(formData).subscribe((res: any) => {

                this.hide[this.cart.productId] = true;
                this.messageService.sendMessage(res.productNumberInCart);

                this.toastrService.success('Ürun Sepete Eklendi', '', {
                    timeOut: 2000
                });
            },
                err => {
                    this.toastrService.warning('Urun Sepete Eklenemedi');

                });
        }
        else {


        }
    }


    getMainpageCategories(): void {

        this.homeService.getMainpageCategories().subscribe((res: any) => {
            this.mainpageCategories = res.categories;


    


            for (const array of this.mainpageCategories) {
                for (const product of array.products) {
                    // tslint:disable-next-line:max-line-length


              
                    this.sizes = product.sizes;
                    this.colors = product.colors;

                    if (product.colors.length != 0) {

                        product.discount = ((product.colors[0].listPrice - product.colors[0].salePrice) / product.colors[0].listPrice) * 100;
                    }

                    if (product.sizes.length != 0) {

                        product.discount = ((product.sizes[0].listPrice - product.sizes[0].salePrice) / product.sizes[0].listPrice) * 100;
                    }


                    product.discount = Math.floor(product.discount);
                    product.orderQuantity = 1;


                }
            }


            this.getCart();

        }, err => {
            //this.showError(err.error);
        });






    }







    getMainPageBlog(): void {

        this.homeService.getMainPageBlog().subscribe((res: any) => {
            this.articles = res.blogs;

        }, err => {
            //this.showError(err.error);
        });
    }


    getMainPageVideo(): void {

        this.homeService.getMainPageVideo().subscribe((res: any) => {
            this.videos = res.videos;

            this.videos.forEach(v => {

                v.videoUrl = this.getTrustedUrl(v.videoUrl);
            });

        }, err => {
            //this.showError(err.error);
        });
    }

    getTrustedUrl(url: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    togglePaused() {
        if (this.paused) {
            this.carousel.cycle();
        } else {
            this.carousel.pause();
        }
        this.paused = !this.paused;
    }

    onSlide(slideEvent: NgbSlideEvent) {
        if (this.unpauseOnArrow && slideEvent.paused &&
            (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
            this.togglePaused();
        }
        if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
            this.togglePaused();
        }
    }


    getCart() {
        this.cartService.getCart(this.customerId).subscribe((res: any) => {
            this.cart = res.cart;



            for (const productGroup of this.productLatests) {
                for (const product of productGroup) {

                    if (this.cart.find(x => x.product._id === product._id)) {


                        this.hide[product._id] = true;


                        product.orderQuantity = this.cart.find(x => x.product._id === product._id).unit;

                    }
                }

            }


            for (const category of this.mainpageCategories) {
                for (const product of category.products) {
                    if (this.cart.find(x => x.product._id === product._id)) {
                        this.hide[product._id] = true;
                        product.orderQuantity = this.cart.find(x => x.product._id === product._id).unit;
                    }
                }
            }

        },
            err => {


            });
    }

}
