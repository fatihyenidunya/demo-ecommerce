import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ContactService } from '../contact.service';
import { CartService } from '../../_cart/cart.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {


    name = '';
    lastName = '';
    mail = '';
    phone = '';
    message = '';

    successMessage = '';


    constructor(
        private contactService: ContactService,
        private cartService: CartService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections


    ) {



    }


    ngOnInit() {

        window.scrollTo(0, 0);
    }

    OnSubmit(form: NgForm) {


        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('lastName', this.lastName);
        formData.append('mail', this.mail);
        formData.append('phone', this.phone);
        formData.append('message', this.message);

        this.contactService.postMessage(formData)
            .subscribe((res: any) => {
                this.successMessage = res.message;

            }, err => {

            });

    }

}
