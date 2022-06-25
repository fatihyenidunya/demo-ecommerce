import { Component, OnInit } from '@angular/core';
import { AppConnections } from '../../app.connections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { OrderRetailService } from '../../_order-retailer/order-retail.service';
import { CargoService } from '../cargo.service';
import { ProductService } from '../../_product/product.service';

import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';

import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-cargo-edit',
  templateUrl: './cargo-edit.component.html',
  styleUrls: ['./cargo-edit.component.scss']
})
export class CargoEditComponent implements OnInit {
  nodejsApi;
  orderId;

  totalTL = 0;
  shippedTotal = 0;
  shippedGrandTotal = 0;
  shippedCurrency;
  approvedButtonDisabled = true;
  selectDisable = true;
  shipmentBtnDisable = true;
  disableShipmentTxt = false;
  disableProducerTxt = false;
  order;
  orderProducts;

  country;
  customer;
  orderDate;
  lastOrderStatus;

  id;
  from;
  show = false;
  userName;
  public statuses = JSON.parse('[{"status":"Getting Ready"},{"status":"Shipment Successed"},{"status":"Order Canceled"}]');
  public selectedStatus;



  isCollapsed = false;

  selectedDeliveryFname;
  selectedDeliveryLname;
  selectedDeliveryPhone;
  selectedDeliveryEmail;
  selectedDeliveryAddress1;
  selectedDeliveryAddress2;
  selectedDeliveryState;
  selectedDeliveryCity;
  selectedDeliveryZipCode;
  selectedDeliveryCountryCode;


  selectedBillFname;
  selectedBillLname;
  selectedBillPhone;
  selectedBillEmail;
  selectedBillAddress1;
  selectedBillAddress2;
  selectedBillCity;
  selectedBillState;
  selectedBillZipCode;
  selectedBillCountryCode;
  header;


  constructor(
    private modalService: NgbModal,
    private cargoService: CargoService,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private orderRetailService: OrderRetailService,

    private ngxIndexedDBService: NgxIndexedDBService,


    private confirmationService: ConfirmationDialogService,

  ) {

    this.nodejsApi = appConnections.nodejsApi;
    this.id = this.route.snapshot.params['id'];
    this.from = this.route.snapshot.params['from'];




    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.userName = user.oUserName;


    });

  }

  ngOnInit() {
    if (this.from === 'shipment') {
      // this.getShipment(this.id);
      this.show = true;
    } else {
      this.orderId = this.id;
      this.getOrder(this.orderId);
      this.show = false;

    }
  }

  selectStatus(status) {
    this.selectedStatus = status;


    if (this.selectedStatus === 'Shipment Successed') {
      this.approvedButtonDisabled = false;
    }

    if (this.selectedStatus === 'Getting Ready') {
      this.approvedButtonDisabled = true;

    }

    if (this.selectedStatus === 'Order Canceled') {
      this.approvedButtonDisabled = true;
    }

  }

  public approveThis() {


    const data = {
      userName: this.userName,
      orderId: this.orderId,
      status: this.selectedStatus

    };

    this.orderRetailService.approveThis(data).subscribe((res: any) => {

      if (this.selectedStatus === res.message) {
        this.approvedButtonDisabled = !this.approvedButtonDisabled;
        this.lastOrderStatus = this.selectedStatus;
        this.selectDisable = true;

      }

    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });


  }

  public getOrder(id): void {
    this.orderRetailService.getOrderRetail(id).subscribe((res: any) => {
      this.order = res.order;
      // this.country = this.order.country;
      this.customer = this.order.customer;
      this.orderDate = this.order.createdAt;
      this.orderProducts = res.order.products;
      this.selectedStatus = res.order.status;
      this.lastOrderStatus = this.selectedStatus;
      if (this.selectedStatus === 'Getting Ready') {

        this.selectDisable = false;

      }
      this.approvedButtonDisabled = true;


      this.selectedBillFname = this.order.billing[0].name;
      this.selectedBillLname = this.order.billing[0].lastName;
      this.selectedBillEmail = this.order.billing[0].email;
      this.selectedBillPhone = this.order.billing[0].phone;
      this.selectedBillAddress1 = this.order.billing[0].addressOne;
      this.selectedBillAddress2 = this.order.billing[0].addressTwo;
      this.selectedBillZipCode = this.order.billing[0].zipCode;
      this.selectedBillCity = this.order.billing[0].city;
      this.selectedBillCountryCode = this.order.billing[0].countryCode;
      this.selectedBillState = this.order.billing[0].state;



      this.selectedDeliveryFname = this.order.delivery[0].name;
      this.selectedDeliveryLname = this.order.delivery[0].lastName;
      this.selectedDeliveryEmail = this.order.delivery[0].email;
      this.selectedDeliveryPhone = this.order.delivery[0].phone;
      this.selectedDeliveryAddress1 = this.order.delivery[0].addressOne;
      this.selectedDeliveryAddress2 = this.order.delivery[0].addressTwo;
      this.selectedDeliveryZipCode = this.order.delivery[0].zipCode;
      this.selectedDeliveryCity = this.order.delivery[0].city;
      this.selectedDeliveryCountryCode = this.order.delivery[0].countryCode;
      this.selectedDeliveryState = this.order.delivery[0].state;


      console.log(this.order);


    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });
  }




  OnSubmit(form: NgForm) {
    if (this.selectedStatus === 'Shipment Successed') {
      this.confirmForShipment();
    } else {
      this.approveThis();
    }


  }



  public confirmForShipment() {

    this.confirmationService.confirm(this.order.customer, 'Do you really want to ship it ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.approveThis();
        } else {
          this.selectedStatus = this.lastOrderStatus;
          this.approvedButtonDisabled = true;
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }


}
