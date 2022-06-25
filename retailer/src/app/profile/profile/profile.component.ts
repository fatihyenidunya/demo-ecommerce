import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProfileService } from '../profile.service';
import { CartService } from '../../_cart/cart.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Contact } from '../model/contact';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


    nodejsApi;

    customerId;
    customerName;
    disable = true;
    contact = new Contact();
    contacts: any;
    isEdit = false;
    newPage = false;
    deleteDisable = false;
    contactId = 0;
    hideForMobile = true;
    profile;

    constructor(
        private profileService: ProfileService,
        private cartService: CartService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,
        public sanitizer: DomSanitizer,

    ) {

        this.nodejsApi = appConnections.nodejsApi;


        this.customerId = localStorage.getItem('customerId');
        this.customerName = localStorage.getItem('customerName');

    }


    ngOnInit() {
        this.customerId = this.route.snapshot.params.id;



        this.getProfile(this.customerId);

        if (window.screen.width < 768) {

            this.hideForMobile = true;

        }

        if (window.screen.width >= 768) {

            this.hideForMobile = true;

        }

        if (window.screen.width >= 992) {

            this.hideForMobile = false;

        }
        if (window.screen.width >= 1200) {

            this.hideForMobile = false;
        }


    }

    edit(): void {
        // this.newPage = !this.newPage;
        // this.disable = false;

        this.disable = false;


    }


    editContact(id): void {
        this.newPage = !this.newPage;
        this.disable = false;

        this.deleteDisable = false;
        this.contactId = id;

    }
    getProfile(customerId): void {

        this.profileService.getProfile(customerId).subscribe((res: any) => {
            this.profile = res.profile;
            console.log(this.profile);
        }, err => {
            //this.showError(err.error);
        });
    }






    click() {

        this.newPage = !this.newPage;
        this.disable = false;
        this.deleteDisable = true;
        this.cleanData();


    }


    update() {

        const formData = new FormData();
        formData.append('name', this.profile.name);
        formData.append('surname', this.profile.surname);
        formData.append('company', this.profile.company);
        formData.append('phone', this.profile.phone);
        formData.append('email', this.profile.email);
        formData.append('tcId', this.profile.tcId);
        formData.append('taxPlace', this.profile.taxPlace);
        formData.append('taxNo', this.profile.taxNo);

        this.profileService.updateProfile(this.customerId, formData)
            .subscribe((res: any) => {
                this.profile = res.profile;
                //this.showInfo();
            }, err => {
                console.log('the error ' + JSON.stringify(err));
                // this.showError(err);
            });


        this.disable = true;
    }


    OnSubmitContact(form: NgForm) {


        const formData = new FormData();
        formData.append('customerId', this.customerId);
        formData.append('addressName', this.contact.addressName);
        formData.append('name', this.contact.name);
        formData.append('lastName', this.contact.lastName);
        formData.append('identityNumber', this.contact.identityNumber);
        formData.append('email', this.contact.email);
        formData.append('phone', this.contact.phone);
        formData.append('company', this.contact.company);
        formData.append('addressOne', this.contact.addressOne);
        formData.append('addressTwo', this.contact.addressTwo);
        formData.append('zipCode', this.contact.zipCode);
        formData.append('city', this.contact.city);
        formData.append('state', this.contact.state);
        formData.append('countryCode', 'Tr');
        formData.append('country', 'Turkiye');



        if (this.contactId !== 0) {
            this.profileService.updateContact(this.contactId, formData)
                .subscribe((res: any) => {
                    //this.showInfo();
                }, err => {
                    console.log('the error ' + JSON.stringify(err));
                    // this.showError(err);
                });
        }

        else {
            this.profileService.postContact(formData)
                .subscribe((res: any) => {


                }, err => {

                });
        }
    }


    cleanData() {
        this.contact.addressName = '';
        this.contact.name = '';
        this.contact.lastName = '';
        this.contact.company = '';
        this.contact.addressOne = '';
        this.contact.addressTwo = '';
        this.contact.zipCode = '';
        this.contact.city = '';
        this.contact.phone = '';
        this.contact.email = '';
        this.contact.state = '';

    }






}
