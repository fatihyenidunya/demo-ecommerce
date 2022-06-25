import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AgreementService } from '../agreement.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../model/chat';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-agreement',
    templateUrl: './agreement.component.html',
    styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {


   
    agreement: any;
    orderId;


    constructor(private agreementService: AgreementService,
                private route: ActivatedRoute,
                private router: Router,
                private appConnections: AppConnections


    ) {
        this.orderId = this.route.snapshot.params.orderId;



    }


    ngOnInit() {
        this.getAgreement(this.orderId);
   

    }

    getAgreement(orderId) {


        this.agreementService.getAgreement(orderId)
            .subscribe((res: any) => {

                console.log(res)
                this.agreement = res;


            }, err => {

            });

    }



}
