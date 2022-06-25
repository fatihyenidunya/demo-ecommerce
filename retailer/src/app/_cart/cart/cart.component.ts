import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConnections } from '../../app.connections';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  nodejsApi;
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  cart;
  grandTotal = 0;
  currency;
  customerId;

  productsPage = false;

  hide = false;
  hideForMobile = true;
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private appConnections: AppConnections,
    private messageService: MessageService) {

    // this.customId = this.route.snapshot.params['id'];

    this.customerId = localStorage.getItem('customerId');
    this.nodejsApi = appConnections.nodejsApi;

  }

  ngOnInit() {
    this.getCart();
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

  getCart(): void {

    this.cartService.getCart(this.customerId).subscribe((res: any) => {
      this.cart = res.cart;

      this.grandTotal = 0;
      this.cart.forEach(p => {

        this.grandTotal += p.totalPrice;
        this.currency = p.currency;


      });

      if (this.cart.length === 0) {

        this.productsPage = true;
      }

    }, err => {
      // this.showError(err.error);
    });

  }

  changeQuantity(id, quantity, salePrice) {

    const formData = new FormData();
    formData.append('quantity', quantity);
    formData.append('salePrice', salePrice);


    this.cartService.putUpdateCart(this.customerId, id, formData).subscribe((res: any) => {
      this.cart = res.cart;





      this.grandTotal = 0;
      this.cart.forEach(p => {

        this.grandTotal += p.totalPrice;
        this.currency = p.currency;


      });

    }, err => {
      // this.showError(err.error);
    });



  }

  outOfCart(cartId) {
    this.cartService.getOutOfCart(this.customerId, cartId).subscribe((res: any) => {
      this.cart = res.cart;

      this.grandTotal = 0;
      this.cart.forEach(p => {

        this.grandTotal += p.totalPrice;
        this.currency = p.currency;


      });


      this.messageService.sendMessage(res.productNumberInCart.toString());
      console.log(this.cart);
    }, err => {
      // this.showError(err.error);
    });
  }


}
