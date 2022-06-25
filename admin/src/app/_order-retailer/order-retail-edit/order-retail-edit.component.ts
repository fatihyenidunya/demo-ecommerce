import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { OrderRetailService } from '../order-retail.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { OrderRetail } from '../model/orderRetail';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SmsComponent } from '../../sms.component';

@Component({
  selector: 'app-order-retail-edit',
  templateUrl: './order-retail-edit.component.html',
  styleUrls: ['./order-retail-edit.component.scss']
})
export class OrderRetailEditComponent implements OnInit, OnDestroy {
  navigationSubscription;
  nodejsApi;
  // tslint:disable-next-line:max-line-length
  public statuses;
  public selectedStatus;

  lastSelectedStatus;
  orderRetailerProductTransactions;
  orderRetailTransactions;

  approvedButtonDisabled = true;
  cargoBtnDisable = false;
  disable = false;
  orderCanceledBtnDisable = true;

  orderId;
  grandTotal = 0;

  userName;
  header;

  orderRetail: any;
  orderProducts;
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

  constructor(private orderRetailService: OrderRetailService,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private confirmationService: ConfirmationDialogService,
    private modalService: NgbModal,
    private ngxIndexedDBService: NgxIndexedDBService,
    private smsComponent: SmsComponent

  ) {

    this.statuses = JSON.parse('[{"status":"' + this.appConnections.PendingApproval + '"},{"status":"' + this.appConnections.OrderApproved + '"},{"status":"' + this.appConnections.GettingReady + '"},{"status":"' + this.appConnections.ShipmentSuccessed + '"},{"status":"' + this.appConnections.CanceledWanted + '"},{"status":"' + this.appConnections.CanceledApproved + '"},{"status":"' + this.appConnections.OrderCanceled + '"}]');

    this.nodejsApi = appConnections.nodejsApi;

    // subscribe to the router events - storing the subscription so
    // we can unsubscribe later.
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {

        this.nodejsApi = appConnections.nodejsApi;
        const id = this.route.snapshot.params['id'];



        this.orderId = id;
        this.getOrder(this.orderId);


      }
    });


  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {
      this.header = user.oUserToken;
      this.userName = user.oUserName;


    });


  }
  ngOnDestroy() {

    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

  }


  disableButtons(status) {
    if (status === this.appConnections.PendingApproval) {
      this.orderCanceledBtnDisable = true;
      this.cargoBtnDisable = true;
      this.approvedButtonDisabled = false;
    }

    if (status === this.appConnections.OrderApproved) {
      this.orderCanceledBtnDisable = true;
      this.cargoBtnDisable = true;
      this.approvedButtonDisabled = false;
    }
    if (status === this.appConnections.GettingReady) {
      this.orderCanceledBtnDisable = true;
      this.cargoBtnDisable = true;
      this.approvedButtonDisabled = false;
    }
    if (status === this.appConnections.ShipmentSuccessed) {
      this.orderCanceledBtnDisable = true;
      this.cargoBtnDisable = false;
      this.approvedButtonDisabled = false;
    }
    if (status === this.appConnections.OrderCanceled) {
      this.orderCanceledBtnDisable = false;
      this.cargoBtnDisable = true;
      this.approvedButtonDisabled = false;
    }
    if (status === this.appConnections.CanceledApproved) {
      this.orderCanceledBtnDisable = false;
      this.cargoBtnDisable = true;
      this.approvedButtonDisabled = false;
    }
  }

  selectStatus(status) {
    this.selectedStatus = status;

    this.disableButtons(status);


  }



  public approveThis(status) {



    const data = {
      userName: this.userName,
      orderId: this.orderId,
      status: status

    };

    this.orderRetailService.approveThis(data).subscribe((res: any) => {
      this.orderRetailTransactions = res.orderRetailTransactions;
      if (this.selectedStatus === res.message) {
        this.approvedButtonDisabled = !this.approvedButtonDisabled;
        this.cargoBtnDisable = false;
        if (this.selectedStatus === this.appConnections.GettingReady || this.appConnections.ShipmentSuccessed) {
          this.cargoBtnDisable = false;
        }
        if (this.selectedStatus === this.appConnections.PendingApproval) {
          this.cargoBtnDisable = true;
        }
        if (this.selectedStatus === this.appConnections.OrderApproved) {
          this.cargoBtnDisable = true;

          this.smsComponent.sendSMS(this.orderRetail.delivery[0].name + ' ' + this.orderRetail.delivery[0].lastName, this.orderRetail.delivery[0].phone, this.orderRetail.referanceCode + this.smsComponent.smsOrderApprovedMessage, this.smsComponent.smsOrderApprovedFor);

        }
      }

    }, err => {
    });




  }

  public getOrder(id): void {
    this.orderRetailService.getOrderRetail(id).subscribe((res: any) => {

      this.orderRetail = res.order;
      this.orderProducts = res.order.products;
      this.selectedStatus = res.order.status;
      this.orderRetailTransactions = res.orderRetailTransactions;
      this.orderRetailerProductTransactions = res.orderRetailerProductTransactions;



      if (this.selectedStatus === this.appConnections.GettingReady || this.appConnections.ShipmentSuccessed) {
        this.cargoBtnDisable = false;
      }

      if (this.selectedStatus === this.appConnections.OrderCanceled) {
        this.cargoBtnDisable = true;
        this.approvedButtonDisabled = true;
      }
      if (this.selectedStatus === this.appConnections.PendingApproval) {
        this.cargoBtnDisable = true;
      }
      if (this.selectedStatus === this.appConnections.OrderApproved) {
        this.cargoBtnDisable = true;
      }

      this.selectedBillFname = this.orderRetail.billing[0].name;
      this.selectedBillLname = this.orderRetail.billing[0].lastName;
      this.selectedBillEmail = this.orderRetail.billing[0].email;
      this.selectedBillPhone = this.orderRetail.billing[0].phone;
      this.selectedBillAddress1 = this.orderRetail.billing[0].addressOne;
      this.selectedBillAddress2 = this.orderRetail.billing[0].addressTwo;
      this.selectedBillZipCode = this.orderRetail.billing[0].zipCode;
      this.selectedBillCity = this.orderRetail.billing[0].city;
      this.selectedBillCountryCode = this.orderRetail.billing[0].countryCode;
      this.selectedBillState = this.orderRetail.billing[0].state;
      // this.orderRetail.billing.BILL_FAX;


      this.selectedDeliveryFname = this.orderRetail.delivery[0].name;
      this.selectedDeliveryLname = this.orderRetail.delivery[0].lastName;
      this.selectedDeliveryEmail = this.orderRetail.delivery[0].email;
      this.selectedDeliveryPhone = this.orderRetail.delivery[0].phone;
      this.selectedDeliveryAddress1 = this.orderRetail.delivery[0].addressOne;
      this.selectedDeliveryAddress2 = this.orderRetail.delivery[0].addressTwo;
      this.selectedDeliveryZipCode = this.orderRetail.delivery[0].zipCode;
      this.selectedDeliveryCity = this.orderRetail.delivery[0].city;
      this.selectedDeliveryCountryCode = this.orderRetail.delivery[0].countryCode;
      this.selectedDeliveryState = this.orderRetail.delivery[0].state;
      // this.orderRetail.delivery.DELIVERY_FAX;









    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });
  }

  // orderCanceled() {

  //   this.confirmForShipment();

  // }

  public confirmForShipment() {

    this.confirmationService.confirm(this.orderRetail.customer, 'Do you really want to cancel it ???')
      .then((confirmed) => {
        if (confirmed === true) {
          this.approveThis(this.selectedStatus);
          this.orderCanceledBtnDisable = true;
          this.cargoBtnDisable = true;


        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  public orderCanceled() {

    const date = new Date(this.orderRetail.createdAt);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    console.log(this.orderRetail);

    this.confirmationService.confirm(this.orderRetail.billing[0].BILL_COUNTRYCODE + ' - ' + this.orderRetail.customer + ' - ' + month + '/' + day + '/' + year + ' - ' + hours + ':' + minutes, 'Do you really want to cancel this order?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.orderCanceledBtnDisable = true;
          this.cargoBtnDisable = true;
          this.orderCancel(this.orderId, this.userName);


        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }


  orderCancel(orderId, userName) {
    this.orderRetailService.orderCanceld(orderId, userName).subscribe((res: any) => {


      // this.orderCustomer = res.orderProduct;
      // this.orderProducts = res.orderProduct.products;
      // this.orderTransactions = res.orderTransactions;
      // this.orderProductTransactions = res.orderProductTransactions;


    });

  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }



}


