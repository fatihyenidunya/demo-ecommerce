import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../../__auth/user.service';
import { MessageService } from '../../../message.service';
import { Subscription, Observable } from 'rxjs';
import { AppConnections } from '../../../app.connections';

import * as io from 'socket.io-client';
import { NotifyService } from '../../../_notify/notify.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;
    userClaims;

    userId;
    subscription: Subscription;

    socket;
    operationSocket;
    warehouseSocket;
    warehouseRetailerSocket;

    preparingNotifies: any = [];
    preparingNotifyCount = 0;

    readyForShippingNotifies: any = [];
    readyForShippingNotifyCount = 0;

    dealerOrderCanceledNotifies: any = [];
    dealerOrderCanceledNotifyCount = 0;

    orderPromotionsNotifies: any = [];
    orderPromotionsNotifyCount = 0;

    shippedNotifies: any = [];
    shippedNotifyCount = 0;

    approvedOrders: any = [];
    approvedOrderCount = 0;

    approvedShipments: any = [];
    approvedShipmentCount = 0;

    customerSocket;



    newOrders: any = [];
    newOrderCount = 0;

    customerOperationSocket;

    newCustomerOrders: any = [];
    newCustomerOrderCount = 0;

    customerApprovedOrders: any = [];
    customerApprovedOrderCount = 0;

    customerPreparingNotifies: any = [];
    customerPreparingNotifyCount = 0;


    warehouseCustomerOrderCanceledNotifyCount = 0;
    warehouseCustomerOrderCanceledNotifies: any = [];

    warehouseApprovedOrderRetailers: any = [];
    warehouseApprovedOrderRetailerCount = 0;

    customerReadyForShippingNotifies: any = [];
    customerReadyForShippingNotifyCount = 0;

    customerShippedNotifies: any = [];
    customerShippedNotifyCount = 0;

    customerApprovedShipments: any = [];
    customerApprovedShipmentCount = 0;

    customerOrderCanceledNotifies: any = [];
    customerOrderCanceledNotifyCount = 0;

    customerOrderCanceledWantedNotifies: any = [];
    customerOrderCanceledWantedNotifyCount = 0;


    reservationOkayNotifies: any = [];
    reservationOkayNotifyCount = 0;

    canceledOkayNotifies: any = [];
    canceledOkayNotifyCount = 0;

    canceledWantedNotifies: any = [];
    canceledWantedNotifyCount = 0;

    // warehouse


    warehouseApprovedOrders: any = [];
    warehouseApprovedOrderCount = 0;


    warehouseGettingReadyNotifies: any = [];
    warehouseGettingReadyNotifyCount = 0;

    warehouseApprovedShipments: any = [];
    warehouseApprovedShipmentCount = 0;

    warehouseOrderCanceledNotifies: any = [];
    warehouseOrderCanceledNotifyCount = 0;

    warehouseProductAddonNotifies: any = [];
    warehouseProductAddonNotifyCount = 0;

    warehouseProductGiftNotifies: any = [];
    warehouseProductGiftNotifyCount = 0;

    warehouseReservationWantedNotifies: any = [];
    warehouseReservationWantedNotifyCount = 0;

    warehouseCanceledWantedNotifies: any = [];
    warehouseCanceledWantedNotifyCount = 0;


    operationHide = false;
    warehouseHide = false;
    userRole;
    public userName;
    socketIOUrl;
    website;

    pendingApproval;
    gettingReady;
    gettingReady_;
    shipmentSuccessed_;
    shipmentSuccessed;
    orderApproved;
    orderCanceled;
    canceledWanted_;
    canceledOkay_;
    canceledWanted;

    // tslint:disable-next-line:max-line-length
    constructor(private translate: TranslateService,
        private appConnections: AppConnections,
        public router: Router,
        private userService: UserService,
        private ngxIndexedDBService: NgxIndexedDBService,
        private messageService: MessageService,
        private notifyService: NotifyService) {

        this.socketIOUrl = appConnections.socketIOUrl;
        this.website = appConnections.website;

        this.pendingApproval = this.website + '/notifies/operation/' + this.appConnections.PendingApproval;
        this.gettingReady_ = this.website + '/notifies/operation/' + this.appConnections.GettingReady;
        this.shipmentSuccessed_ = this.website + '/notifies/operation/' + this.appConnections.ShipmentSuccessed;
        this.canceledWanted_ = this.website + '/notifies/operation/' + this.appConnections.CanceledWanted;
        this.canceledOkay_ = this.website + '/notifies/operation/' + this.appConnections.CanceledOkay;


        this.gettingReady = this.appConnections.GettingReady;
        this.shipmentSuccessed = this.appConnections.ShipmentSuccessed;
        this.orderApproved = this.website + '/notifies/warehouse/' + this.appConnections.OrderApproved;
        this.orderCanceled = this.website + '/notifies/warehouse/' + this.appConnections.OrderCanceled;
        this.canceledWanted = this.website + '/notifies/warehouse/' + this.appConnections.CanceledWanted;

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });

        // this.socket = io.connect('http://localhost:5500/orders');
        // this.operationSocket = io.connect('http://localhost:5500/operations');
        // this.customerSocket = io.connect('http://localhost:5500/customer-orders');
        // this.customerOperationSocket = io.connect('http://localhost:5500/customer-operations');
        // this.warehouseSocket = io.connect('http://localhost:5500/warehouse');


        this.socket = io.connect(this.socketIOUrl + 'orders');
        this.operationSocket = io.connect(this.socketIOUrl + 'operations');
        this.customerSocket = io.connect(this.socketIOUrl + 'customer-orders');
        this.customerOperationSocket = io.connect(this.socketIOUrl + 'customer-operations');
        this.warehouseSocket = io.connect(this.socketIOUrl + 'warehouse');
        this.warehouseRetailerSocket = io.connect(this.socketIOUrl + 'warehouse-retailer');

        // Bireysel Müşterinin ödeme (payment) bildirimleri orderNotifies tablosuna kayıt ediliyor
        // sakın payment tablosunu silme !!!!!!!!!!

    }

    changeNotify(notify) {





    }


    ngOnInit() {
        this.pushRightClass = 'push-right';

        this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

            // this.header = user.oUserToken;
            this.userRole = user.oUserRole;
            this.userName = user.oUserName;


            if (this.userRole === 'Warehouse') {
                this.operationHide = true;

            }
            if (this.userRole === 'Operation') {
                this.warehouseHide = true;
            }

            if (this.userRole === 'Seller') {
                this.warehouseHide = true;
            }



            this.updateNotify(this.userName, 'dealer');
            this.updateRetailerNotify(this.userName, 'customer');
            this.updateWarehouseNotify('dealer');
            this.updateWarehouseNotify('customer');

            this.socket.on('newOrder', order => {

                if (order.orderNotify.notifyOwner === this.userName) {

                    this.newOrders.unshift(order.orderNotify);
                    this.newOrderCount++;
                   

                }

            });

            this.operationSocket.on('operation', data => {

                if (data.status === this.appConnections.OrderApproved) {

                    this.approvedOrders = data.notifies;
                    this.approvedOrderCount = data.unSeenCount;

                }

                if (data.status === this.appConnections.GettingReady) {




                    if (data.notifies[0].orderOwner === this.userName) {
                        this.preparingNotifies = data.notifies;
                        this.preparingNotifyCount = data.unSeenCount;
                    }


                }

                if (data.status === this.appConnections.WaitingforShipmentApproval) {



                    if (data.notifies[0].orderOwner === this.userName) {
                        this.readyForShippingNotifies = data.notifies;
                        this.readyForShippingNotifyCount = data.unSeenCount;
                    }


                }

                if (data.status === this.appConnections.ShipmentSuccessed) {



                    if (data.notifies[0].orderOwner === this.userName) {

                        this.shippedNotifies = data.notifies;
                        this.shippedNotifyCount = data.unSeenCount;
                    }


                }

                // if (data.status === 'Shipment Approved') {

                //     this.approvedShipments = data.notifies;
                //     this.approvedShipmentCount = data.unSeenCount;

                // }

                // if (data.status === 'Order Canceled') {

                //     this.dealerOrderCanceledNotifies = data.notifies;
                //     this.dealerOrderCanceledNotifyCount = data.unSeenCount;


                // }

                if (data.status === this.appConnections.PromotionsChanged) {

                    if (data.notifies[0].orderOwner === this.userName) {
                        this.orderPromotionsNotifies = data.notifies;
                        this.orderPromotionsNotifyCount = data.unSeenCount;
                    }

                }

                if (data.status === this.appConnections.ReservationOkay) {

                    if (data.notifies[0].orderOwner === this.userName) {
                        this.reservationOkayNotifies = data.notifies;
                        this.reservationOkayNotifyCount = data.unSeenCount;
                    }

                }

                if (data.status === this.appConnections.CanceledOkay) {

                    if (data.notifies[0].orderOwner === this.userName) {

                        this.canceledOkayNotifies = data.notifies;
                        this.canceledOkayNotifyCount = data.unSeenCount;

                    }
                }
            });

            this.socket.on('updateNotifyDealer', data => {
                this.updateNotify(this.userName, 'dealer');
            });


            this.warehouseSocket.on('operation', data => {

                if (data.status === this.appConnections.OrderApproved) {

                    this.warehouseApprovedOrders = data.notifies;
                    this.warehouseApprovedOrderCount = data.unSeenCount;

                }

                if (data.status === this.appConnections.GettingReady) {

                    this.warehouseGettingReadyNotifies = data.notifies;
                    this.warehouseGettingReadyNotifyCount = data.unSeenCount;

                }

                if (data.status === this.appConnections.ShipmentApproved) {

                    this.warehouseApprovedShipments = data.notifies;
                    this.warehouseApprovedShipmentCount = data.unSeenCount;

                }


                if (data.status === this.appConnections.ProductNumberChanged) {

                    this.warehouseProductAddonNotifies = data.notifies;
                    this.warehouseProductAddonNotifyCount = data.unSeenCount;

                }

                if (data.status === this.appConnections.PromotionsChanged) {

                    this.warehouseProductGiftNotifies = data.notifies;
                    this.warehouseProductGiftNotifyCount = data.unSeenCount;

                }

                if (data.status === this.appConnections.ReservationWanted) {

                    this.warehouseReservationWantedNotifies = data.notifies;
                    this.warehouseReservationWantedNotifyCount = data.unSeenCount;

                }


                if (data.status === this.appConnections.CanceledWanted) {


                    this.warehouseCanceledWantedNotifies = data.notifies;
                    this.warehouseCanceledWantedNotifyCount = data.unSeenCount;

                }

            });

            this.warehouseSocket.on('updateNotifyWarehouse', data => {

                this.updateWarehouseNotify('dealer');
            });

            this.warehouseRetailerSocket.on('updateNotifyRetailerWarehouse', data => {

                this.updateWarehouseNotify('customer');
            });



            this.customerSocket.on('newOrder', order => {

                this.newCustomerOrders.unshift(order.orderNotify);
                this.newCustomerOrderCount++;

                console.log(order);

            });

            this.customerSocket.on('updateNotifyCustomer', data => {
                this.updateRetailerNotify(this.userName, 'customer');
            });

            this.customerOperationSocket.on('operation', data => {

                if (data.status === this.appConnections.OrderApproved) {

                    this.customerApprovedOrders = data.notifies;
                    this.customerApprovedOrderCount = data.unSeenCount;


                }

                if (data.status === this.appConnections.GettingReady) {

                    this.customerPreparingNotifies = data.notifies;
                    this.customerPreparingNotifyCount = data.unSeenCount;

                }



                if (data.status === this.appConnections.ShipmentSuccessed) {

                    this.customerShippedNotifies = data.notifies;
                    this.customerShippedNotifyCount = data.unSeenCount;

                }

                if (data.status === this.appConnections.ShipmentApproved) {

                    this.customerApprovedShipments = data.notifies;
                    this.customerApprovedShipmentCount = data.unSeenCount;

                }
                if (data.status === this.appConnections.OrderCanceled) {

                    this.customerOrderCanceledNotifies = data.notifies;
                    this.customerOrderCanceledNotifyCount = data.unSeenCount;


                }






            });
        });
    }

    checkNotify(orderId, orderStatus, number) {


        this.notifyService.checkNotify(orderId, orderStatus, number).subscribe((res: any) => {
            this.router.navigate(['/warehouse/edit/' + orderId]);

        });


    }

    checkOrderOperationNotify(orderId, orderStatus, number) {


        this.notifyService.checkOrderOperationNotify(orderId, orderStatus, number).subscribe((res: any) => {
            this.router.navigate(['/orders/' + orderId]);

        });


    }

    updateNotify(userName, notifyFor) {



        this.notifyService.getOrderNotifies(notifyFor, this.userName, this.userRole).subscribe((res: any) => {


            if (notifyFor === 'dealer') {


                this.newOrders = res.notifies;
                this.newOrderCount = res.unSeenCount;



            } else {
                this.newCustomerOrders = res.notifies;
                this.newCustomerOrderCount = res.unSeenCount;
            }



        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.OrderApproved).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.approvedOrders = res.notifies;

                this.approvedOrderCount = res.unSeenCount;
            } else {
                this.customerApprovedOrders = res.notifies;
                this.customerApprovedOrderCount = res.unSeenCount;
            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.GettingReady).subscribe((res: any) => {



            if (notifyFor === 'dealer') {
                this.preparingNotifies = res.notifies;
                if (res.notifies[0].orderOwner === this.userName) {
                    this.preparingNotifyCount = res.unSeenCount;
                }

            } else {
                this.customerPreparingNotifies = res.notifies;
                this.customerPreparingNotifyCount = res.unSeenCount;
            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.WaitingforShipmentApproval).subscribe((res: any) => {


            if (notifyFor === 'dealer') {
                this.readyForShippingNotifies = res.notifies;
                if (res.notifies[0].orderOwner === this.userName) {
                    this.readyForShippingNotifyCount = res.unSeenCount;
                }

            } else {
                this.customerReadyForShippingNotifies = res.notifies;
                this.customerReadyForShippingNotifyCount = res.unSeenCount;
            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.ShipmentApproved).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.approvedShipments = res.notifies;
                this.approvedShipmentCount = res.unSeenCount;
            } else {
                this.customerApprovedShipments = res.notifies;
                this.customerApprovedShipmentCount = res.unSeenCount;
            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.ShipmentSuccessed).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.shippedNotifies = res.notifies;
                if (res.notifies[0].orderOwner === this.userName) {
                    this.shippedNotifyCount = res.unSeenCount;
                }

            } else {
                this.customerShippedNotifies = res.notifies;
                this.customerShippedNotifyCount = res.unSeenCount;
            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.OrderCanceled).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.dealerOrderCanceledNotifies = res.notifies;
                this.dealerOrderCanceledNotifyCount = res.unSeenCount;
            } else {
                this.customerOrderCanceledNotifies = res.notifies;
                this.customerOrderCanceledNotifyCount = res.unSeenCount;


            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.PromotionAddedByWarehouse).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.orderPromotionsNotifies = res.notifies;
                this.orderPromotionsNotifyCount = res.unSeenCount;
            } else {
                // this.customerOrderCanceledNotifies = res.notifies;
                // this.customerOrderCanceledNotifyCount = res.unSeenCount;


            }

        });

        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.ReservationOkay).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.reservationOkayNotifies = res.notifies;
                this.reservationOkayNotifyCount = res.unSeenCount;
            } else {
                // this.customerOrderCanceledNotifies = res.notifies;
                // this.customerOrderCanceledNotifyCount = res.unSeenCount;


            }

        });


        this.notifyService.getNotifies(userName, notifyFor, this.appConnections.CanceledOkay).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.canceledOkayNotifies = res.notifies;
                this.canceledOkayNotifyCount = res.unSeenCount;
            } else {
                // this.customerOrderCanceledNotifies = res.notifies;
                // this.customerOrderCanceledNotifyCount = res.unSeenCount;


            }

        });



    }


    updateRetailerNotify(userName, notifyFor) {



        this.notifyService.getOrderRetailerNotifies(notifyFor, this.userName, this.userRole).subscribe((res: any) => {

          

            this.newCustomerOrders = res.notifies;
            this.newCustomerOrderCount = res.unSeenCount;

               

        });

        // this.notifyService.getRetailerNotifies(userName, notifyFor, 'Order Approved').subscribe((res: any) => {


        //     this.customerApprovedOrders = res.notifies;
        //     this.customerApprovedOrderCount = res.unSeenCount;


        // });

        this.notifyService.getRetailerNotifies(userName, notifyFor, this.appConnections.GettingReady).subscribe((res: any) => {




            this.customerPreparingNotifies = res.notifies;
            this.customerPreparingNotifyCount = res.unSeenCount;


        });




        this.notifyService.getRetailerNotifies(userName, notifyFor, this.appConnections.ShipmentSuccessed).subscribe((res: any) => {


            this.customerShippedNotifies = res.notifies;
            this.customerShippedNotifyCount = res.unSeenCount;


        });

        this.notifyService.getRetailerNotifies(userName, notifyFor, this.appConnections.CanceledWanted).subscribe((res: any) => {

            this.customerOrderCanceledWantedNotifies = res.notifies;
            this.customerOrderCanceledWantedNotifyCount = res.unSeenCount;


        });



        this.notifyService.getRetailerNotifies(userName, notifyFor, this.appConnections.OrderCanceled).subscribe((res: any) => {

            this.customerOrderCanceledNotifies = res.notifies;
            this.customerOrderCanceledNotifyCount = res.unSeenCount;

        });



    }



    updateWarehouseNotify(notifyFor) {


        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.OrderApproved).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseApprovedOrders = res.notifies;
                this.warehouseApprovedOrderCount = res.unSeenCount;
            } else {

                this.warehouseApprovedOrderRetailerCount = res.unSeenCount;
                this.warehouseApprovedOrderRetailers = res.notifies;
            }

        });

        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.GettingReady).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseGettingReadyNotifies = res.notifies;
                this.warehouseGettingReadyNotifyCount = res.unSeenCount;


            } else {



            }

        });



        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.ShipmentApproved).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseApprovedShipments = res.notifies;
                this.warehouseApprovedShipmentCount = res.unSeenCount;
            } else {

            }

        });


        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.ProductNumberChanged).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseProductAddonNotifies = res.notifies;
                this.warehouseProductAddonNotifyCount = res.unSeenCount;


            } else {



            }

        });





        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.PromotionsChanged).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseProductGiftNotifies = res.notifies;
                this.warehouseProductGiftNotifyCount = res.unSeenCount;


            } else {



            }

        });

        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.ReservationWanted).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseReservationWantedNotifies = res.notifies;
                this.warehouseReservationWantedNotifyCount = res.unSeenCount;


            } else {



            }

        });

        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.CanceledWanted).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseCanceledWantedNotifies = res.notifies;
                this.warehouseCanceledWantedNotifyCount = res.unSeenCount;


            } else {



            }

        });

        this.notifyService.getWarehouseNotifies(notifyFor, this.appConnections.CanceledApproved).subscribe((res: any) => {

            if (notifyFor === 'dealer') {
                this.warehouseCanceledWantedNotifies = res.notifies;
                this.warehouseCanceledWantedNotifyCount = res.unSeenCount;


            } else {
                this.warehouseCustomerOrderCanceledNotifyCount = res.unSeenCount;
                this.warehouseCustomerOrderCanceledNotifies = res.notifies;


            }

        });

    }

    Logout() {

        this.router.navigate(['/login']);






    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
