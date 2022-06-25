import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConnections } from '../../app.connections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OrderProductRetailerTransactionService } from '../../__order-product-retailer-transaction/order-product-retailer-transaction.service';

import { WarehouseRetailService } from '../warehouse-retail.service';
import { ProductService } from '../../_product/product.service';
import { CargoCompanyService } from '../../_cargo-company/cargo-company.service';
import { ConfirmationCargoService } from '../../__confirm-cargo/confirmation-cargo.service';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { NgForm } from '@angular/forms';
import { LayoutComponent } from '../../layout/layout.component';

// tslint:disable-next-line:max-line-length


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { UserService } from '../../__auth/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../_product/model/product';

import { resolve } from 'url';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SmsComponent } from '../../sms.component';

@Component({
  selector: 'app-warehouse-retail-edit',
  templateUrl: './warehouse-retail-edit.component.html',
  styleUrls: ['./warehouse-retail-edit.component.scss']
})
export class WarehouseRetailEditComponent implements OnInit {

  nodejsApi;
  orderId;
  userName;
  // tslint:disable-next-line:max-line-length
  public statuses;
  public selectedStatus;


  product = new Product();
  orderCustomer: any;
  orderProducts;
  orderProductStatus: any;
  disable = false;
  canceled = false;
  isApproved = false;
  approvedButtonDisabled = true;
  cargoInfoDisabled = true;
  productGeadyButtonDisabled = true;
  header;
  isCollapsed = false;
  cargoCompanies;
  selectedCargoCompany;
  cargoCompany;
  pastStatus = '';
  public trackingCode = '';
  constructor(
    private warehouseRetailService: WarehouseRetailService,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private userService: UserService,
    private modalService: NgbModal,
    private orderProductRetailerTransactionService: OrderProductRetailerTransactionService,
    private ngxIndexedDBService: NgxIndexedDBService,
    private cargoCompanyService: CargoCompanyService,
    private confirmationCargoService: ConfirmationCargoService,
    private confirmationDialogService: ConfirmationDialogService,
    private smsComponent: SmsComponent

  ) {

    this.router.events.subscribe((e: any) => {

      if (e instanceof NavigationEnd) {

        this.statuses = JSON.parse('[{"status":"' + this.appConnections.OrderApproved + '"},{"status":"' + this.appConnections.GettingReady + '"},{"status": "' + this.appConnections.ShipmentSuccessed + '"},{"status": "' + this.appConnections.CanceledApproved + '" },{"status":  "' + this.appConnections.OrderCanceled + '" }]');


        this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

          this.header = user.oUserToken;
          this.userName = user.oUserName;

          this.nodejsApi = appConnections.nodejsApi;
          const id = this.route.snapshot.params['id'];
          this.orderId = id;
          this.getCargoCompanies();
          this.getOrder(this.orderId);


        });

      }
    });



  }

  ngOnInit() {




    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {
      this.header = user.oUserToken;
      this.userName = user.oUserName;


    });
  }

  public getOrder(id): void {
    this.warehouseRetailService.get(id).subscribe((res: any) => {
      this.orderCustomer = res.order;



      this.orderProducts = res.order.products;


      this.selectedStatus = this.orderCustomer.status;
      this.selectedCargoCompany = res.order.cargoCompany;
      this.trackingCode = res.order.trackingCode;

      if (this.orderCustomer.status === 'Hazirlaniyor') {
        this.approvedButtonDisabled = true;
        this.cargoInfoDisabled = false;
        this.productGeadyButtonDisabled = false;
      }

      if (this.orderCustomer.status === 'Gonderildi') {

        this.approvedButtonDisabled = true;
        this.cargoInfoDisabled = true;
        this.productGeadyButtonDisabled = true;

      }



    }, err => {
    });
  }


  selectStatus(status) {

    this.selectedStatus = status;


    if (this.selectedStatus === this.appConnections.OrderApproved) {
      this.approvedButtonDisabled = true;
      this.cargoInfoDisabled = true;
      this.productGeadyButtonDisabled = true;
    }
    if (this.selectedStatus === this.appConnections.GettingReady) {
      this.approvedButtonDisabled = false;

    }

    if ((this.selectedStatus === this.appConnections.ShipmentSuccessed && this.trackingCode === undefined)) {

      this.approvedButtonDisabled = true;

      this.confirmationDialogService.confirm('Takip Kodu Girmelisiniz', 'Kargo Firması ve Takip kodu girmeden siparişinizi gönderemezsiniz')
        .then((confirmed) => {

        })
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

    } else {
      this.approvedButtonDisabled = false;

    }


  }


  getCargoCompanies(): void {

    this.cargoCompanyService.getsd(this.header).subscribe((res: any) => {
      this.cargoCompanies = res.cargoCompanies;
      this.selectedCargoCompany = res.cargoCompanies[0].company;


    }, err => {
      this.showError(err.error);
    });


  }

  selectCargoCompany(selected) {
    this.cargoCompany = selected;
    this.selectedCargoCompany = selected;


  }

  public approveThis() {




    this.SaveInfo();




  }


  private SaveInfo() {

    const data = {
      userName: this.userName,
      orderId: this.orderId,
      status: this.selectedStatus

    };

    this.warehouseRetailService.warehouseApproveThis(data).subscribe((res: any) => {




      if (res.message === 'Hazirlaniyor') {
        this.approvedButtonDisabled = false;
        this.cargoInfoDisabled = false;
        this.productGeadyButtonDisabled = false;
      }

      if (res.message === 'Gonderildi') {

        this.approvedButtonDisabled = true;
        this.cargoInfoDisabled = true;
        this.productGeadyButtonDisabled = true;

        let __message = this.orderCustomer.referanceCode + ' kodlu siparişiniz ' + this.orderCustomer.trackingCode + ' takip numarası ile ' + this.orderCustomer.cargoCompany + '\' ya teslim edilmiştir.';
        this.smsComponent.sendSMS(this.orderCustomer.delivery[0].name + ' ' + this.orderCustomer.delivery[0].lastName, this.orderCustomer.delivery[0].phone, __message, this.smsComponent.smsOrderShippedFor);

      }

    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        console.log(err.error);
      }
    });
  }


  public confirmCargoTrackingCode() {

    this.confirmationCargoService.confirm(this.orderCustomer.customer, this.selectedCargoCompany, this.trackingCode, this.orderCustomer.delivery[0])
      .then((confirmed) => {
        if (confirmed === true) {

          const formData = new FormData();

          formData.append('orderId', this.orderId);
          formData.append('cargoCompany', this.selectedCargoCompany);
          formData.append('trackingCode', this.trackingCode);

          this.warehouseRetailService.updateCargoInformation(formData).subscribe((res: any) => {




            this.approvedButtonDisabled = false;
            this.getOrder(this.orderId);



          }, err => {

          });
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  public updateCargoInformation() {




  }


  // tslint:disable-next-line:max-line-length
  public operation(_id, customer, orderId, productId, image, product, operation, stockCode, productStock, orderProductUnitNumber, readyProductUnitNumber) {




    if (this.orderCustomer.status === this.appConnections.ShipmentSuccessed) {

      alert('Gönderilmiş siparişten ürün çıkarılamaz veya eklenemez!!!');

    } else {




      // tslint:disable-next-line:max-line-length
      this.orderProductRetailerTransactionService.confirm(customer, orderId, productId, this.nodejsApi, image, product, this.userName, operation, productStock, orderProductUnitNumber, readyProductUnitNumber)
        .then((confirmed) => {
          if (confirmed === true) {


            const formData = new FormData();
            formData.append('_id', _id);
            formData.append('orderId', orderId);
            formData.append('productId', productId);
            formData.append('imageUrl', image);
            formData.append('productTitle', product);
            formData.append('stockCode', stockCode);
            formData.append('userName', this.userName);
            formData.append('operation', operation);
            formData.append('newProductUnitNumber', this.appConnections.newProductUnitNumber);
            formData.append('orderProductUnitNumber', String(orderProductUnitNumber));
            // formData.append('quantityInBox', String(quantityInBox));




            // console.log('_id '  + _id);
            // console.log('customer ' + customer);
            // console.log('orderId ' + orderId);
            // console.log('productId ' + productId);
            // console.log('image ' + image);
            // console.log('product ' + product);
            // console.log('userName ' +  this.userName);

            // console.log('orderProductUnitNumber ' +  String(orderProductUnitNumber));
            // console.log('readyProductUnitNumber ' + this.appConnections.newProductUnitNumber);

            this.warehouseRetailService.warehouseRetailerOperationd(formData).subscribe((res: any) => {
              this.orderProducts = res.orderProduct;

              console.log(this.orderProducts);

              // tslint:disable-next-line:max-line-length
              // this.orderProducts.find(x => x.product._id === productId).readyUnitNumber = Number(this.orderProducts.readyUnitNumber);
              // this.orderProducts.find(x => x.product._id === productId).status = this.orderProducts.status;
              // this.orderProducts.find(x => x.product._id === productId).product.stock = this.orderProducts.stock;

            }, err => {

            });

          }
        })
        // tslint:disable-next-line:max-line-length
        .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

    }



  }



  saveCanceled(_id, orderId, productId, unit, unitPrice, box, orderDate, totalPrice, currency, operation, readyProductBoxNumber) {



  }



  undo(orderId, productId) {


  }

  public showError(error) {

    if (error.message === 'jwt expired') {
      this.router.navigate(['../../../login']);
    } else {
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.name = JSON.stringify(error);
      console.log(error);
    }

  }


}
