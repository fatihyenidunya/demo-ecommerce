import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { ProductRoutingModule } from './profile-routing.module';
import { ProfileService } from './profile.service';


@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        ProductRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        ProfileService
    ]

})
export class ProfileModule { }
