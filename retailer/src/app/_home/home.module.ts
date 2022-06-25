import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './home.service';


@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        HomeService
    ]

})
export class HomeModule { }
