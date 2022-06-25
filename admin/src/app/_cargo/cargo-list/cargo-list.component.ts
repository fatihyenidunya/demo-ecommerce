import { Component, OnInit } from '@angular/core';
import { CargoService } from '../cargo.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';


@Component({
  selector: 'app-cargo-list',
  templateUrl: './cargo-list.component.html',
  styleUrls: ['./cargo-list.component.scss']
})
export class CargoListComponent implements OnInit {

  totalItems = 0;

  grandTotal = 0;


  shipments;

  public pageNumber = 1;
  public pageSize = 20;
  endDate;
  startDate;

  startMonth = '1';
  startDay = '1';
  startYear = '2000';

  endMonth = '12';
  endDay = '30';
  endYear = '2030';

  textforsearch;

  orders;
  header;
  public selectedStatus = 'All';
  public statuses = JSON.parse('[{"status":"All"},{"status":"Shipment Approved"},{"status":"Shipment Successed"}]');

  constructor(private modalService: NgbModal, private cargoService: CargoService,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private ngxIndexedDBService: NgxIndexedDBService

  ) {




  }

  onChange(text) {


    if (text.length > 2) {
      this.textforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    if (text.length === 0) {

      this.textforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

  }

  selectStartDate(date): void {

    this.pageNumber = 1;
    this.startMonth = this.startDate.month;
    this.startDay = this.startDate.day;
    this.startYear = this.startDate.year;

    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectEndDate(date): void {

    this.pageNumber = 1;

    this.endMonth = this.endDate.month;
    this.endDay = this.endDate.day;
    this.endYear = this.endDate.year;

    // this.orderQuery.endDate = new Date(this.endDate.year + '/' + this.endDate.month + '/' + this.endDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  ngOnInit() {


    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);


    });



  }

  selectStatus(status) {

    this.selectedStatus = status;
    this.pageNumber = 1;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  getQueryResults(page, customer, status, startmonth, startday, startyear, endmonth, endday, endyear): void {



    // tslint:disable-next-line:max-line-length
    this.cargoService.getQueryResult(page, this.pageSize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear, this.header)
      .subscribe((res: any) => {

        this.orders = res.orders;
        this.totalItems = res.totalItems;

        console.log(this.orders);

      }, err => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }

  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
