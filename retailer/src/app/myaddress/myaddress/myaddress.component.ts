import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MyaddressService } from '../myaddress.service';
import { CartService } from '../../_cart/cart.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Contact } from '../model/contact';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-myaddress',
    templateUrl: './myaddress.component.html',
    styleUrls: ['./myaddress.component.css']
})
export class MyaddressComponent implements OnInit {


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

    cities;
    states = [];
    selectedCity;
    selectedState;

    constructor(
        private myaddressService: MyaddressService,
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
        this.getContacts();

        this.cities = this.appConnections.cities.sort((a, b) => a.name.localeCompare(b.name, undefined, { caseFirst: "upper" }));
        this.selectedCity = this.cities[0];
        this.selectCity(this.selectedCity);
        this.selectState(this.states[0]);

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


    }

    selectCity(selected) {

        this.states = [];
    
        for (let state of this.appConnections.states) {
    
          if (state.il_id === selected.id) {
            this.states.push(state);
          }
        }
    
        this.states = this.states.sort((a, b) => a.name.localeCompare(b.name, undefined, { caseFirst: "upper" }));
        this.selectedCity = selected;
    
    
      }
    
      selectState(selected) {
    
        this.selectedState = selected;
    
    
      }

    editContact(id): void {
        this.newPage = !this.newPage;
        this.disable = false;
        this.getContact(id);
        this.deleteDisable = false;
        this.contactId = id;

    }
    getProfile(): void {

        this.myaddressService.getProfile(this.customerId).subscribe((res: any) => {
            this.contacts = res.contacts;
            console.log(this.contacts);
        }, err => {
            //this.showError(err.error);
        });
    }


    getContact(id): void {

        this.myaddressService.getContact(id).subscribe((res: any) => {
            this.contact = res.contact;
            console.log(this.contact);
        }, err => {
            //this.showError(err.error);
        });
    }


    deleteContact(id): void {



        this.myaddressService.deleteContact(this.customerId, id).subscribe((res: any) => {
            this.contacts = res.contacts;
            this.newPage = !this.newPage;
            console.log(this.contact);
        }, err => {
            //this.showError(err.error);
        });
    }


    getContacts(): void {

        this.myaddressService.getContacts(this.customerId).subscribe((res: any) => {
            this.contacts = res.contacts;
            console.log(this.contacts);
        }, err => {
            //this.showError(err.error);
        });
    }

    click() {

        this.newPage = !this.newPage;
        this.disable = false;
        this.deleteDisable = true;
        this.cleanData();
        this.getContacts();

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
        formData.append('taxPlace', this.contact.taxPlace);
        formData.append('taxNo', this.contact.taxNo);
        formData.append('zipCode', this.contact.zipCode);
        formData.append('city', this.contact.city);
        formData.append('state', this.contact.state);
        formData.append('countryCode', 'Tr');
        formData.append('country', 'Turkiye');



        if (this.contactId !== 0) {
            this.myaddressService.updateContact(this.contactId, formData)
                .subscribe((res: any) => {
                    this.cleanData();
                    this.newPage = !this.newPage;
                    this.getContacts();
                }, err => {
                    console.log('the error ' + JSON.stringify(err));
                    // this.showError(err);
                });
        }

        else {
            this.myaddressService.postContact(formData)
                .subscribe((res: any) => {
                    this.newPage = !this.newPage;
                    this.getContacts();
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
        this.contact.taxPlace = '';
        this.contact.taxNo = '';
        this.contact.zipCode = '';
        this.contact.city = '';
        this.contact.phone = '';
        this.contact.email = '';
        this.contact.state = '';

    }






}
