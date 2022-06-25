import { Component, OnInit } from '@angular/core';
import { WarehouseRetailService } from '../warehouse-retail.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';

@Component({
  selector: 'app-warehouse-retail-list',
  templateUrl: './warehouse-retail-list.component.html',
  styleUrls: ['./warehouse-retail-list.component.scss']
})
export class WarehouseRetailListComponent implements OnInit {

  totalItems = 20;

  grandTotal = 0;
  orderModel: any;
  note;
  officer;
  website;

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

  public isCollapsed = false;
  public selectedStatus = 'Hepsi';

  textforsearch;
  public statuses;

  constructor(private warehouseRetailService: WarehouseRetailService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private appConnections: AppConnections,

  ) {

    this.statuses = JSON.parse('[{"status":"Hepsi"},{"status":"' + this.appConnections.OrderApproved + '"},{"status":"' + this.appConnections.GettingReady + '"},{"status":"' + this.appConnections.WaitingforShipmentApproval + '"},{"status":"' + this.appConnections.ShipmentSuccessed + '"},{"status":"' + this.appConnections.CanceledWanted + '"},{"status":"' + this.appConnections.CanceledApproved + '"},{"status":"' + this.appConnections.OrderCanceled + '"}]');
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);


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
    // this.orderQuery.startDate = new Date(this.startDate.year + '/' + this.startDate.month + '/' + this.startDate.day);
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
  }

  selectStatus(status) {

    this.selectedStatus = status;
    this.pageNumber = 1;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  getQueryResults(page, customer, status, startmonth, startday, startyear, endmonth, endday, endyear): void {



    // tslint:disable-next-line:max-line-length
    this.warehouseRetailService.getWarehouseQueryResult(page, this.pageSize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear)
      .subscribe((res: any) => {

        console.log(res.orders);

        this.orderModel = res.orders;
        this.totalItems = res.totalItems;

      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(err);
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
