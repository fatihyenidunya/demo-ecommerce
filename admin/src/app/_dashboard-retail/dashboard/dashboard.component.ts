import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Custom } from '../model/custom';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ReportDialogService } from '../../__report/report-dialog.service';
import { ProductService } from '../../_product/product.service';
import { ProductStockPopupService } from '../../__product-stock-popup/product-stock-popup.service';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  nodejsApi;

  messages;
  contacts;
  comments;
  orders;
  products;
  totalProduct;


  pending = 0;
  shipped = 0;
  gettingReady = 0;
  canceled = 0;
  revenue = 0;
  currency = 'TL';
  header;
  imageApi;

  _pendingApproval;
  _gettingReady;
  _shipmentSuccessed;
  _orderCanceled;

  selectedMonth;
  selectedYear;

  months;
  yearly;


  pageNumber = 1;
  pageSize = 10;

  calculating = '';

  constructor(private dashboardService: DashboardService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService,
    private reportDialogService: ReportDialogService,
    private productService: ProductService,
    private productStockPopupService: ProductStockPopupService


  ) {

    this.nodejsApi = appConnections.nodejsApi;

    this._pendingApproval = this.appConnections.PendingApproval;
    this._gettingReady = this.appConnections.GettingReady;
    this._shipmentSuccessed = this.appConnections.ShipmentSuccessed;
    this._orderCanceled = this.appConnections.OrderCanceled;

    this.months = this.appConnections.months;

    this.yearly = JSON.parse('{"month":"Yillik","number":0,"lastDay":0}');

    if (!this.months.find(x => x.month === this.yearly.month)) {
      this.months.push(this.yearly);
    }



    this.imageApi = appConnections.imageApi;
  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.pendingCounts(this.appConnections.PendingApproval, this.header);
      this.gettingReadyCounts(this.appConnections.GettingReady, this.header);
      this.shipmentCounts(this.appConnections.ShipmentSuccessed, this.header);
      this.canceledCounts(this.appConnections.OrderCanceled, this.header);

      const date = new Date();
      this.selectedMonth = this.months.find(x => x.number === date.getMonth() + 1);
      this.selectedYear = date.getFullYear();


      this.getContacts(this.header);
      this.getMessages(this.header);
      this.getComments(this.header);
      this.getOrders(this.header);

      // this.getProductStock(this.pageNumber, this.pageSize);
      
      this.calculating = 'Hesaplanıyor...';
      this.monthlyRevenue(this.selectedMonth.number, this.selectedMonth.lastDay, this.selectedYear);

    });




  }

  gettingReadyCounts(status, header): void {

    this.dashboardService.getCounts(status, header).subscribe((res: any) => {

      this.gettingReady = res.totalItems;

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }

  pendingCounts(status, header): void {

    this.dashboardService.getCounts(status, header).subscribe((res: any) => {

      this.pending = res.totalItems;

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }

  shipmentCounts(status, header): void {

    this.dashboardService.getCounts(status, header).subscribe((res: any) => {

      this.shipped = res.totalItems;

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }

  canceledCounts(status, header): void {

    this.dashboardService.getCounts(status, header).subscribe((res: any) => {



      this.canceled = res.totalItems;


    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }


  selectMonth(selectedMonth) {
    this.calculating = 'Hesaplanıyor...';
    this.monthlyRevenue(selectedMonth.number, selectedMonth.lastDay, this.selectedYear);

  }

  monthlyRevenue(month, lastDay, year): void {

    this.dashboardService.getMonthlyRevenue(month, lastDay, year, this.header).subscribe((res: any) => {



      this.revenue = res.revenue.toFixed(2);


    
      this.calculating = '';

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }


  public detailReport() {

    this.reportDialogService.confirm('Aylık veya Yıllık Detaylı Rapor Alabilirsiniz', 'Detaylı Rapor gönderilecek mail adreslerini aralara virgül (,) koyarak aşşağıdaki alana yazabilirsiniz')
      .then((reportSetting: any) => {



        this.getDetailReport(reportSetting.type.type, reportSetting.year.year, reportSetting.month.month, reportSetting.month.number, reportSetting.month.lastDay, reportSetting.email);



      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    this.getProductStock(this.pageNumber, this.pageSize);

  }


  getProductStock(page, pagesize): void {

    this.productService.getProductStock(page, pagesize, this.header).subscribe((res: any) => {
      this.products = res.products;
      this.totalProduct = res.totalProduct;
    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }

    });


  }

  public updateStock(productId, productTitle, imageUrl, stock) {




    // this.productStockPopupService.confirm(productId, productTitle, imageUrl, stock)
    //   .then((confirmed) => {

    //     this.getProductStock(this.pageNumber, this.pageSize);
    //   })

    //   .catch(() => console.log('Error '));

  }



  getDetailReport(type, year, month, monthNumber, monthLastDay, email): void {

    this.dashboardService.getDetailReport(type, year, month, monthNumber, monthLastDay, email, this.header).subscribe((res: any) => {



    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }

  getContacts(header): void {

    this.dashboardService.getContacts(header).subscribe((res: any) => {

      this.contacts = res.messages;

      console.log(this.contacts);

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }


  getMessages(header): void {

    this.dashboardService.getChats(header).subscribe((res: any) => {

      this.messages = res.chats;
      console.log(this.messages);

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }


  getComments(header): void {

    this.dashboardService.getComments(header).subscribe((res: any) => {

      this.comments = res.comments;
      console.log(this.comments);

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }


  getOrders(header): void {

    this.dashboardService.getOrderRetails(header).subscribe((res: any) => {

      this.orders = res.orders;

      console.log(this.orders);

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));

      }
    });
  }

  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }



}
