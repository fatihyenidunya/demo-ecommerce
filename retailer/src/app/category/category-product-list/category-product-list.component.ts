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
import { AppComponent } from '../../app.component';

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
  sizes;
  colors;

  selectedSize;
  selectedColor;

  breadCrumb;

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
    private appComponent: AppComponent,
    private metaService: Meta) {

    this.nodejsApi = appConnections.nodejsApi;
    this.customerId = localStorage.getItem('customerId');

    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      if (e instanceof NavigationEnd) {
        this.category = this.route.snapshot.params.category;
        //  this.categoryId =history.state.id;


        this.appComponent.isChange = false;
        this.appComponent.isSubMenuChange = false;

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


      for (const array of this.categories) {
        for (const product of array.products) {
          this.sizes = product.sizes;
          this.colors = product.colors;

          if (product.colors.length != 0) {

            product.discount = ((product.colors[0].listPrice - product.colors[0].salePrice) / product.colors[0].listPrice) * 100;
          }

          if (product.sizes.length != 0) {

            product.discount = ((product.sizes[0].listPrice - product.sizes[0].salePrice) / product.sizes[0].listPrice) * 100;
          }


          product.discount = Math.floor(product.discount);
          product.orderQuantity = 1;


        }
      }


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

  selectColor(color) {

    alert(JSON.stringify(color))
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }

  }

  addToCart(productId, productTitle, orderQuantity, stockCode, salePrice, currency, color, volume, volumeEntity) {



    if (orderQuantity !== 0) {

      this.cart.customerId = this.customerId;
      this.cart.unitPrice = salePrice;
      this.cart.currency = currency;
      this.cart.productId = productId;
      this.cart.productTitle = productTitle;
      this.cart.unit = orderQuantity;
      this.cart.stockCode = stockCode;
      this.cart.color = color;
      // this.cart.totalPrice = orderQuantity * this.cart.unitPrice;





      // if (this.selectedSize !== 'undefined' && this.selectedSize !== '' && this.selectedSize !== undefined) {
      //     this.cart.size = this.selectedSize.size;
      // } else {
      //     this.cart.size = volume + volumeEntity;
      // }


      const formData = new FormData();
      formData.append('customer', this.cart.customerId);
      formData.append('product', this.cart.productId);
      formData.append('productTitle', this.cart.productTitle);
      formData.append('unitPrice', String(this.cart.unitPrice));
      formData.append('unit', String(orderQuantity));
      formData.append('stockCode', this.cart.stockCode);
      formData.append('totalPrice', String((this.cart.unitPrice * orderQuantity).toFixed(2)));
      formData.append('currency', this.cart.currency);
      formData.append('country', 'Turkiye');
      formData.append('color', this.cart.color);
      formData.append('volume', volume);
      formData.append('volumeEntity', volumeEntity);


      this.cartService.addToCart(formData).subscribe((res: any) => {

        this.hide[this.cart.productId] = true;
        this.messageService.sendMessage(res.productNumberInCart);

        this.toastrService.success('Ürun Sepete Eklendi', '', {
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





        if (this.cart.find(x => x.product._id === element._id)) {


          this.hide[element._id] = true;



          element.orderQuantity = this.cart.find(x => x.product._id === element._id).unit;




        }

      });



    },
      err => {
        this.toastrService.warning('Urun Sepete Eklenemedi');

      });
  }

}
