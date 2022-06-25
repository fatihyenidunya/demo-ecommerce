import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { AppConnections } from '../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constants } from 'buffer';
import { Form } from '@angular/forms';
import { AppModel } from '../appModel';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { MessageService } from '../message.service';
import { CartService } from '../_cart/cart.service';
import { Subscription } from 'rxjs';
import { SearchLayoutService } from '../__search-layout/search-layout.service';
import { AppComponent } from '../app.component';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

    @ViewChild('auto') auto;

    title = 'order-system-retail';
    nodejsApi;
    general;
    generalId = '5f3cb9f31466dc04807ea01a';

    customerId = '';
    customerName = '';



    categories;
    subCategories = [];

    textforsearch;
    searchProducts = [];

    keyword = 'title';

    newsletter = new AppModel();


    cartProductCount = 0;
    subscription: Subscription;
    hideGoTopBtn = true;
    hideForMobile = true;
    innerWidth;

    constructor(
        private appService: AppService,
        private route: ActivatedRoute,
        private router: Router,
        private cartService: CartService,
        private appConnections: AppConnections,
        private titleService: Title,
        private metaService: Meta,
        private messageService: MessageService,
        private searchLayoutService: SearchLayoutService,
        private appComponent:AppComponent



    ) {

        this.nodejsApi = appConnections.nodejsApi;
        this.customerName = localStorage.getItem('customerName');

        this.customerId = localStorage.getItem('customerId');



        //this.menuHide();
        // this.getCenterToRigthAlign();
        this.getScreenWidthForInit();
        this.getGeneral();
        this.subscription = this.messageService.getMessage().subscribe(message => {
            if (message) {
                this.cartProductCount = message.text;

            }
        });



    }


    public openSearchLayout() {

        this.searchLayoutService.confirm('Ürün ara', 'ürün bul')
            .then((confirmed) => {

            })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }


    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit() {



        this.getCategoriesForMenu();


        this.getCart(this.customerId);
    

        //   this.socialAuthService.authState.subscribe((user) => {
        //     this.socialUser = user;
        //     this.socialLoggedIn = (user != null);
        // });
    }

    onChange(text) {




    }



    // tslint:disable-next-line:typedef
    // menuHide() {

    //     let align = 'center';

    //     if (window.screen.width < 768) {
    //         align = 'center';
    //         this.hideForMobile = false;
    //     }

    //     if (window.screen.width >= 768) {
    //         align = 'right';
    //         this.hideForMobile = false;
    //     }

    //     if (window.screen.width >= 992) {
    //         align = 'right';
    //         this.hideForMobile = true;
    //     }
    //     if (window.screen.width >= 1200) {
    //         align = 'right';
    //         this.hideForMobile = true;
    //     }

    //     return align;

    // }




    getScreenWidthForInit() {



        if (window.innerWidth < 768) {

            this.hideForMobile = true;
        }

        if (window.innerWidth >= 768) {

            this.hideForMobile = true;
        }

        if (window.innerWidth >= 992) {

            this.hideForMobile = false;
        }
        if (window.innerWidth >= 1200) {

            this.hideForMobile = false;
        }
    }

    @HostListener('window:resize', ['$event'])
    // tslint:disable-next-line:typedef
    onListenWindowSize(event) {

        console.log("Screen sizes : " + event.target.innerWidth);

        if (event.target.innerWidth < 768) {

            this.hideForMobile = true;
        }

        if (event.target.innerWidth >= 768) {

            this.hideForMobile = true;
        }

        if (event.target.innerWidth >= 992) {

            this.hideForMobile = false;
      
        }
        if (event.target.innerWidth >= 1200) {

            this.hideForMobile = false;
          
        }

    }

    signOut() {

        localStorage.removeItem("customerId");
        localStorage.removeItem("customerName");
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customerSurname");
        this.router.navigate(['/login']);

    }

    getCart(customerId): void {

        this.cartService.getCart(customerId).subscribe((res: any) => {
            this.cartProductCount = res.cart.length;

        }, err => {
            // this.showError(err.error);
        });

    }

    selectEvent(item) {
        // do something with selected item

        this.router.navigate(['../product', item.titleLower + '&' + item._id]);

    }

    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.


        this.appService.getSearchResult(val).subscribe((res: any) => {
            this.searchProducts = res.products;
        });
    }

    onFocused(e) {
        // do something when input is focused

        e.stopPropagation();
        this.auto.clear();
    }


    getGeneral(): void {

        this.appService.getGeneral(this.generalId).subscribe((res: any) => {
            this.general = res.general;
            this.appConnections.general = res.general;

            this.titleService.setTitle(this.general.title);
            this.metaService.updateTag({ name: 'description', content: this.general.metaDescription });

            console.log(this.general);

        }, err => {


        });
    }

    getCategoriesForMenu(): void {

        this.appService.getCategoriesForMenu().subscribe((res: any) => {
            this.categories = res.categories;



        }, err => {
            // this.showError(err.error);
        });
    }


    @HostListener('window:scroll', ['$event'])
    // tslint:disable-next-line:typedef
    onResize(event) {

        console.log("Screen size : " + event);
        if (window.pageYOffset > 1000) {
            this.hideGoTopBtn = false;

        } else {
            this.hideGoTopBtn = true;
        }
    }



    // tslint:disable-next-line:typedef
    goTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    OnSubmitNewsletter() {

        const formData = new FormData();

        formData.append('mail', this.newsletter.mail);



        this.appService.postNewsletterMail(formData)
            .subscribe((res: any) => {

                this.newsletter.mail = '';

            }, err => {


            });

    }





}
