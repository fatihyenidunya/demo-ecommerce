import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';

import { User } from '../_auth/model/user';
import { AuthService } from '../_auth/auth.service';
import { AppConnections } from '../app.connections';

import { CartService } from '../_cart/cart.service';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


    nodejsApi;
    public user = new User();

    socialLoggedIn: boolean;
    clientIp;

    errorMessage = '';

    showForMobile = false;

    constructor(private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,
        private cartService: CartService,
        private appComponent: AppComponent

    ) {

        this.nodejsApi = appConnections.nodejsApi;
        this.appComponent.showForMobile = true;
    }


    ngOnInit() {


        this.getScreenWidthForInit();
    }


    getScreenWidthForInit() {



        if (window.innerWidth < 768) {

            this.showForMobile = true;
        }

        if (window.innerWidth >= 768) {

            this.showForMobile = true;
        }

        if (window.innerWidth >= 992) {

            this.showForMobile = false;
        }
        if (window.innerWidth >= 1200) {

            this.showForMobile = false;
        }
    }


    @HostListener('window:resize', ['$event'])
    // tslint:disable-next-line:typedef
    onListenWindowSize(event) {


        if (event.target.innerWidth < 768) {

            this.appComponent.showForMobile = true;

            this.showForMobile = true;
        }

        if (event.target.innerWidth >= 768) {

            this.appComponent.showForMobile = true;
            this.showForMobile = false;
        }

        if (event.target.innerWidth >= 992) {

            this.appComponent.showForMobile = true;
            this.showForMobile = false;
        }
        if (event.target.innerWidth >= 1200) {

            this.appComponent.showForMobile = true;
            this.showForMobile = false;
        }

    }



    OnLoginSubmit(form: NgForm) {

        this.cartService.getIPAddress().subscribe((res: any) => {
            this.clientIp = res.ip;


            const formData = new FormData();
            formData.append('password', this.user.password);
            formData.append('email', this.user.email);
            formData.append('ip', this.clientIp);


            this.authService.login(formData)
                .subscribe((result: any) => {
                    localStorage.setItem('customerToken', result.token);
                    localStorage.setItem('customerId', result.userId);
                    localStorage.setItem('customerName', result.name);
                    localStorage.setItem('customerSurname', result.surname);
                    this.appConnections.userName = result.name;
                    this.router.navigate(['../']);
                }, err => {


                    this.errorMessage = err.error.message;

                });
        });

    }

}
