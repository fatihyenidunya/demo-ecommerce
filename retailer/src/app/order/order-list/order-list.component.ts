import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConnections } from '../../app.connections';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  grandTotal = 0;

  public totalOrders = 0;
  public pageNumber = 1;
  public pageSize = 5;
  nodejsApi;

  orders;
  orderDate;


  customerId;
  customerName;
  canceledBtn = true;
  hideForMobile = true;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,

    private confirmationService: ConfirmationDialogService,
    private appConnections: AppConnections) {

    // this.customId = this.route.snapshot.params['id'];
    this.nodejsApi = appConnections.nodejsApi;
    // this.customerId = localStorage.getItem('customerId');
    // this.customerName = localStorage.getItem('customerName');

  }

  ngOnInit() {
    this.customerId = this.route.snapshot.params.id;

    this.getMyOrders(this.pageNumber, this.pageSize);
    if (window.screen.width < 768) {

      this.hideForMobile = true;

    }

    if (window.screen.width >= 768) {

      this.hideForMobile = true;

    }

    if (window.screen.width >= 992) {

      this.hideForMobile = false;

    }
    if (window.screen.width >= 1200) {

      this.hideForMobile = false;
    }
  }


  getMyOrders(pageNumber, pageSize): void {


    this.orderService.getMyOrders(this.customerId, pageNumber, pageSize).subscribe((res: any) => {
      this.orders = res.orders;

      this.totalOrders = res.totalOrders;



    }, err => {
    });
  }




  public orderCanceled(orderDate, orderId) {

    const date = new Date(orderDate);

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const reason = '';

    this.confirmationService.confirm(orderId + ' - ' + month + '/' + day + '/' + year + ' - ' + hours + ':' + minutes, 'İptal etme nedeninizi kısaca belirtmisiniz?')
      .then((confirmed: any) => {

        if (confirmed.confirmed === true) {


          const formData = new FormData();
          formData.append('orderId', orderId);
          formData.append('customerName', this.customerName);
          formData.append('reason', confirmed.reason);



          this.orderCancel(formData);


        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));


  }


  orderCancel(data) {
    this.orderService.orderCanceld(data).subscribe((res: any) => {

      this.canceledBtn = false;
      // this.orderCustomer = res.orderProduct;
      // this.orderProducts = res.orderProduct.products;
      // this.orderTransactions = res.orderTransactions;
      // this.orderProductTransactions = res.orderProductTransactions;


    });

  }


  currentPage(wantedPage): void {

    this.pageNumber = wantedPage;

    this.getMyOrders(this.pageNumber, this.pageSize);

  }

}
