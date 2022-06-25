import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DashboardService } from './dashboard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConnections } from '../../app.connections';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ProductStockPopupService } from '../../__product-stock-popup/product-stock-popup.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbdModalContent } from '../../__server-error/server-error.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

  nodejsApi;
  imageApi;

  gettingReady = 0;
  shipped = 0;
  pending = 0;
  cancel = 0;

  products;
  productsCount;
  header;
  hide = true;
  stockInfo = false;
  math: any;

  productStockPageHide = false;
  semiProductStockPageHide = true;
  rawMaterialStockPageHide = true;

  rawMaterials;
  semiProducts;

  constructor(private modalService: NgbModal, private dashboardService: DashboardService,
    private router: Router, private ngxIndexedDBService: NgxIndexedDBService,
    private productStockPopupService: ProductStockPopupService,
    private ngxSpinnerService: NgxSpinnerService,

    private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.imageApi = appConnections.imageApi;
    // this.header = appConnections.adminHeader;
    this.math = Math;






  }

  ngOnInit() {


    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {





      this.header = user.oUserToken;

      if (user.oUserRole !== 'Stocker') {
        this.hide = false;
        this.gettingReadyCounts('Getting Ready');
        this.shippedCounts('Shipment Successed');
        this.pendingCounts('Pending Approval');
        this.canceledCounts('Canceled Okay');
      }
      this.checkProductsStock(this.header);


    });
  }


  getProductStock() {
    this.productStockPageHide = false;
    this.semiProductStockPageHide = true;
    this.rawMaterialStockPageHide = true;
  }

  getSemiProductStock() {

    this.productStockPageHide = true;
    this.semiProductStockPageHide = false;
    this.rawMaterialStockPageHide = true;


  }

  getRawMaterialStock() {
    this.productStockPageHide = true;
    this.semiProductStockPageHide = true;
    this.rawMaterialStockPageHide = false;



  }

  gettingReadyCounts(status): void {

    this.dashboardService.countsd(status, this.header).subscribe((res: any) => {

      this.gettingReady = res.totalItems;

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        console.log(err.error);

      }
    });
  }

  shippedCounts(status): void {

    this.dashboardService.countsd(status, this.header).subscribe((res: any) => {

      this.shipped = res.totalItems;

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        console.log(err.error);

      }
    });
  }




  pendingCounts(status): void {

    this.dashboardService.countsd(status, this.header).subscribe((res: any) => {

      this.pending = res.totalItems;


    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        console.log(err.error);

      }
    });
  }


  canceledCounts(status): void {

    this.dashboardService.countsd(status, this.header).subscribe((res: any) => {

      this.cancel = res.totalItems;


    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        console.log(err.error);

      }
    });
  }

  checkProductsStock(header): void {



    this.dashboardService.getProductStock(header).subscribe((res: any) => {

      this.products = res.products;
      this.productsCount = res.totalProduct;
      this.stockInfo = true;

      console.log(this.products);


    }, err => {


    });
  }




  public updateStock(productId, productTitle, imageUrl, stock, virtualStock, quantityInBox) {


    this.productStockPopupService.confirm(productId, productTitle, imageUrl, stock, virtualStock, quantityInBox)
      .then((confirmed) => {

        this.checkProductsStock(this.header);
      })

      .catch(() => console.log('Error '));

  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }


}


