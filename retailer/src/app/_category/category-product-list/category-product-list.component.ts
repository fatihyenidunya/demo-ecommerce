import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../category.service';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AppConnections } from '../../app.connections';
import { Title, Meta } from '@angular/platform-browser';
import { Cart } from '../../_product/model/cart';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../_cart/cart.service';
import { MessageService } from '../../message.service';


@Component({
  selector: 'app-category-product-list',
  templateUrl: './category-product-list.component.html',
  styleUrls: ['./category-product-list.component.scss']
})
export class CategoryProductListComponent implements OnInit {
  navigationSubscription;
  grandTotal = 0;

  public totalOrder = 0;
  public pageNumber = 1;
  public pageSize = 5;
  nodejsApi;

  orders;
  hide: boolean[] = [];
  customerId;
  categoryId;
  category;
  categories;
  title;
  cart;
  products;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private titleService: Title,
    private appConnections: AppConnections,
    private toastrService: ToastrService,
    private cartService: CartService,
    private messageService: MessageService,
    private metaService: Meta) {

    this.nodejsApi = appConnections.nodejsApi;
    this.customerId = localStorage.getItem('customerId');

    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      if (e instanceof NavigationEnd) {
        this.category = this.route.snapshot.params.category;
        //  this.categoryId =history.state.id;



        this.getProductsByTopCategory(this.category);


      }

    });



  }

  ngOnInit() {
    //  this.getMyOrders(this.pageNumber, this.pageSize);


    window.scrollTo(0, 0);

  }






  getProductsByCategoryId(categoryId): void {
    this.categoryService.getProductsByCategoryId(categoryId).subscribe((res: any) => {
      this.products = res.products;
      console.log(this.products);
    }, err => {
      //this.showError(err.error);
    });
  }


  getProductsByTopCategory(categoryId): void {
    this.categoryService.getProductsByTopCategory('Turkey', categoryId).subscribe((res: any) => {
      this.categories = res.categories;
      this.title = res.categoryTitle;







      // for (const array of this.categories) {
      //   for (const product of array.products[0]) {
      //     // tslint:disable-next-line:max-line-length
      //     if (product.sizes.length === 0) {
      //       product.discount = ((product.listPrice - product.salePrice) / product.listPrice) * 100;
      //       product.discount = Math.floor(product.discount);
      //     } else {
      //       product.discount = ((product.sizes[0].listPrice - product.sizes[0].salePrice) / product.sizes[0].listPrice) * 100;
      //       product.discount = Math.floor(product.discount);

      //     }
      //   }
      // }


      this.getCart();




      this.titleService.setTitle(res.categoryTitle);
      this.metaService.updateTag({ name: 'description', content: res.categoryMetaDescription });
    }, err => {
      //this.showError(err.error);
    });
  }

  currentPage(wantedPage): void {

    this.pageNumber = wantedPage;

    // this.getMyOrders(this.pageNumber, this.pageSize);

  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

  }

  addToCart(productId, orderQuantity, salePrice, currency, volume, volumeEntity) {



    if (orderQuantity !== 0) {

      this.cart.customerId = this.customerId;
      this.cart.unitPrice = salePrice;
      this.cart.currency = currency;
      this.cart.productId = productId;
      this.cart.unit = orderQuantity;
      // this.cart.totalPrice = orderQuantity * this.cart.unitPrice;





      // if (this.selectedSize !== 'undefined' && this.selectedSize !== '' && this.selectedSize !== undefined) {
      //     this.cart.size = this.selectedSize.size;
      // } else {
      //     this.cart.size = volume + volumeEntity;
      // }


      const formData = new FormData();
      formData.append('customer', this.cart.customerId);
      formData.append('product', this.cart.productId);
      formData.append('unitPrice', String(this.cart.unitPrice));
      formData.append('unit', String(orderQuantity));
      formData.append('totalPrice', String((this.cart.unitPrice * orderQuantity).toFixed(2)));
      formData.append('currency', this.cart.currency);
      formData.append('country', 'Turkiye');
      formData.append('volume', volume);
      formData.append('volumeEntity', volumeEntity);

    
      this.cartService.addToCart(formData).subscribe((res: any) => {

        this.hide[this.cart.productId] = true;
        this.messageService.sendMessage(res.productNumberInCart);

        this.toastrService.success('Urun Sepete Eklendi', '', {
          timeOut: 2000
        });
      },
        err => {
          this.toastrService.warning('Urun Sepete Eklenemedi');

        });
    }
    else {


    }
  }

  getCart() {
    this.cartService.getCart(this.customerId).subscribe((res: any) => {
      this.cart = res.cart;


      this.categories[0].products.forEach(element => {

        if (this.cart.find(x => x.product._id === element.productId._id)) {


          this.hide[element.productId._id] = true;


          element.orderQuantity = this.cart.find(x => x.product._id === element.productId._id).unit;

        }

      });



    },
      err => {
        this.toastrService.warning('Urun Sepete Eklenemedi');

      });
  }

}
