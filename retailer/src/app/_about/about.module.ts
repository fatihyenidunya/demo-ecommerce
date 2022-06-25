import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AboutComponent } from './about/about.component';
import { AboutRoutingModule } from './about-routing.module';
import { AboutService } from './about.service';


@NgModule({
    declarations: [AboutComponent],
    imports: [
        CommonModule,
        AboutRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        AboutService
    ]

})
export class AboutModule { }
