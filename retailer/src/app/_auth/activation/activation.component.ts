import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';

import { User } from '../model/user';
import { AuthService } from '../auth.service';
import { AppConnections } from '../../app.connections';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { CartService } from '../../_cart/cart.service';

@Component({
    selector: 'app-activation',
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {


    nodejsApi;
    public user = new User();
    socialUser: SocialUser;
    socialLoggedIn: boolean;
    clientIp;

    customerId;

    hide = true;

    constructor(private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,
        private socialAuthService: SocialAuthService,
        private cartService: CartService

    ) {

        this.nodejsApi = appConnections.nodejsApi;
        this.customerId = this.route.snapshot.params.customerId;

     
    }


    ngOnInit() {
        


        this.activateAccount();

    }

    signInWithGoogle(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    singInWithFB(): void {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    signOutSocial(): void {
        this.socialAuthService.signOut();
    }



    activateAccount() {


        const formData = new FormData();
        formData.append('customerId', this.customerId);


    

        this.authService.activateAccount(formData).subscribe((result: any) => {
            if (result.activation === true) {
                this.hide = false;
            }


        }, err => {
            console.log(err);


        });


    }

}
