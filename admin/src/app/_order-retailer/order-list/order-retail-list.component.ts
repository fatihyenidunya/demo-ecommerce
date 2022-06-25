import { Component, OnInit } from '@angular/core';
import { OrderRetailService } from '../order-retail.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';

@Component({
  selector: 'app-order-retail-list',
  templateUrl: './order-retail-list.component.html',
  styleUrls: ['./order-retail-list.component.scss']
})
export class OrderRetailListComponent implements OnInit {

  show = true;
  totalItems = 20;
  apiUrl = '';
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

  groupForProducts: any;

  public selectedStatus;
  nodejsApi;

  textforsearch;

  public statuses;
  constructor(private orderRetailService: OrderRetailService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appConnections: AppConnections,
    private ngxSpinnerService: NgxSpinnerService

  ) {

    this.statuses = JSON.parse('[{"status":"Hepsi"},{"status":"' + this.appConnections.PendingApproval + '"},{"status":"' + this.appConnections.OrderApproved + '"},{"status":"' + this.appConnections.GettingReady + '"},{"status":"' + this.appConnections.ShipmentSuccessed + '"},{"status":"' + this.appConnections.OrderCanceled + '"},{"status":"' + this.appConnections.CanceledWanted + '"}]');

    this.nodejsApi = appConnections.nodejsApi;

    const statusFromDashboard = this.route.snapshot.params['status'];

    if (statusFromDashboard !== '' && statusFromDashboard !== 'undefined' && statusFromDashboard !== undefined) {
      this.selectedStatus = statusFromDashboard;


    } else {
      this.selectedStatus = 'Hepsi';
    }

    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);


  }

  changePage(show) {


    if (show === false) {
      this.ngxSpinnerService.show();
      this.orderRetailService.getGroupForProducts().subscribe((res: any) => {
        this.groupForProducts = res.orders;
        this.ngxSpinnerService.hide();
        console.log(res.orders);

      });
    } else {
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    this.show = show;
  }


  selectStatus(status) {

    this.selectedStatus = status;
    this.pageNumber = 1;
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

  getQueryResults(page, customer, status, startmonth, startday, startyear, endmonth, endday, endyear): void {



    // tslint:disable-next-line:max-line-length
    this.orderRetailService.getQueryResults(page, this.pageSize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear)
      .subscribe((res: any) => {



        this.orderModel = res.orders;
        this.totalItems = res.totalItems;

        console.log(this.orderModel);

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
    console.log(error);
  }

}
