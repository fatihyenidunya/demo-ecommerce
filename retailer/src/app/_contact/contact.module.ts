import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact/contact.component';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactService } from './contact.service';


@NgModule({
    declarations: [ContactComponent],
    imports: [
        CommonModule,
        ContactRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        ContactService
    ]

})
export class ContactModule { }
