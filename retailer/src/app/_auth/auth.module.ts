import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ActivationComponent } from './activation/activation.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './auth.service';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider

} from 'angularx-social-login';

@NgModule({
    declarations: [LoginComponent, RegisterComponent, ActivationComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        NgbModule,
        FormsModule,
        SocialLoginModule,
        ReactiveFormsModule
        

    ],
    providers: [
        AuthService, {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('AIzaSyBBKx5U20zgOi_XAugfssHXEUm-fJfsx6E'),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('539544469567726'),
                    },
                ],
            } as SocialAuthServiceConfig,

        }
    ]

})
export class AuthModule { }
