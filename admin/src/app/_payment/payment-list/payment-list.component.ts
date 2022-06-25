import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { PaymentService } from '../payment.service';

import { AppConnections } from '../../app.connections';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {

  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  public pageNumber = 1;
  nodejsApi;
  payments;
  totalPayment;

  header;

  endDate;
  startDate;

  startMonth = '1';
  startDay = '1';
  startYear = '2000';

  endMonth = '12';
  endDay = '30';
  endYear = '2030';


  nameforsearch;
  lastNameforsearch;

  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, public domSanitizer: DomSanitizer, private paymentService: PaymentService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;



  }


  selectStartDate(date): void {

    this.pageNumber = 1;
    this.startMonth = this.startDate.month;
    this.startDay = this.startDate.day;
    this.startYear = this.startDate.year;
    // this.orderQuery.startDate = new Date(this.startDate.year + '/' + this.startDate.month + '/' + this.startDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.nameforsearch, this.lastNameforsearch, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectEndDate(date): void {

    this.pageNumber = 1;

    this.endMonth = this.endDate.month;
    this.endDay = this.endDate.day;
    this.endYear = this.endDate.year;

    // this.orderQuery.endDate = new Date(this.endDate.year + '/' + this.endDate.month + '/' + this.endDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.nameforsearch, this.lastNameforsearch, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  onChange(text) {

    if (text.length > 2) {
      this.nameforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.nameforsearch, this.lastNameforsearch, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    if (text.length === 0) {

      this.nameforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.nameforsearch, this.lastNameforsearch, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }
  }


  onLastNameChange(text) {

    if (text.length > 2) {
      this.lastNameforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.nameforsearch, this.lastNameforsearch, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    if (text.length === 0) {

      this.lastNameforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.nameforsearch, this.lastNameforsearch, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }
  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.getQueryResults(this.pageNumber, '', '', this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    });
  }

  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    // this.gets(this.pageNumber, this.pageSize, this.textforsearch, this.header);

  }



  getQueryResults(page, customer, lastname, startmonth, startday, startyear, endmonth, endday, endyear): void {



    // tslint:disable-next-line:max-line-length
    this.paymentService.getQueryResults(page, this.pageSize, customer, lastname, startmonth, startday, startyear, endmonth, endday, endyear)
      .subscribe((res: any) => {


        this.payments = res.payments;
        this.totalPayment = res.totalPayment;



      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }


  // gets(header): void {

  //   this.paymentService.getPayments(header).subscribe((res: any) => {

  //     this.payments = res.payments;
  //     this.totalPayment = res.totalPayment;


  //   }, err => {
  //     if (err.status === 401) {
  //       this.router.navigate(['/login']);
  //     } else {
  //       this.showError(err);
  //     }
  //   });


  // }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
