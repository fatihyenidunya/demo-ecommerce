import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductComponent } from './product/product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ProductService } from './product.service';
import { NgxSocialShareModule } from 'ngx-social-share';

@NgModule({
    declarations: [ProductComponent],
    imports: [
        NgxSocialShareModule,
        CommonModule,
        ProductRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        ProductService
    ]

})
export class ProductModule { }
