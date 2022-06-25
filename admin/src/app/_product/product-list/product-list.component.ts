import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ProductService } from '../product.service';
import { Product } from '../model/product';
import { ProductQueryModel } from '../model/productQueryModel';
import { AppConnections } from '../../app.connections';
import { ProductStockPopupService } from '../../__product-stock-popup/product-stock-popup.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';




@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public products: any;
  public product = new Product();

  textforsearch;

  public totalProduct = 0;
  public pageNumber = 1;
  public pageSize = 30;
  hideForMobile = true;
  hide = false;
  math: any;
  nodejsApi;
  imageApi;
  header;
  barcodeText;
  disableTitleInput = false;
  disableBarcodeInput = true;

  @ViewChild("barcode") barcodeTxt: ElementRef;

  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private productStockPopupService: ProductStockPopupService, private productService: ProductService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.imageApi = appConnections.imageApi;
    this.math = Math;


  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);

    });



  }

  selectTitle() {
    this.disableTitleInput = false;
    this.disableBarcodeInput = true;
    this.barcodeText = '';
    this.gets(this.pageNumber, this.pageSize, this.textforsearch);
  }

  selectBarcode() {
    this.disableTitleInput = true;
    this.disableBarcodeInput = false;
    this.barcodeTxt.nativeElement.focus();
  }

  onBarcodeChange(text) {

    if (text.length > 2) {

      this.barcodeText = text;

      this.getFindBarcode(this.barcodeText);

    }

    if (text.length === 0) {
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);
    }

  }



  getFindBarcode(barcode): void {

    this.productService.getProductViaBarcode(barcode, this.header).subscribe((res: any) => {
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


  gets(page, pagesize, customer): void {

    this.productService.getsd(page, pagesize, customer, this.header).subscribe((res: any) => {
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


  onChange(text) {

    if (text.length > 2) {
      this.textforsearch = text;
      this.pageNumber = 1;
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);
    }

    if (text.length === 0) {
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);
    }

  }
  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    this.gets(this.pageNumber, this.pageSize, this.textforsearch);

  }

  stockUpdate(productId, productTitle, imageUrl, variable, stockCode) {


    this.productStockPopupService.confirm(productId, productTitle, imageUrl, variable, stockCode)
      .then((confirmed) => {

        this.gets(this.pageNumber, this.pageSize, this.textforsearch);
      })

      .catch(() => console.log('Error '));

  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

  public makePdf() {
    this.productService.makePdf().subscribe((res: any) => {
      alert('product list exported as a PDF file');
    }, err => {
      this.showError(JSON.stringify(err));
    });
  }



  // public updateStock(productId, productTitle, imageUrl, stock) {






  // }




  copy(product) {



    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('turkishTitle', product.turkishTitle);
    formData.append('description', product.description);
    formData.append('metaDescription', product.metaDescription);
    formData.append('color', product.color);
    formData.append('size', product.size);
    formData.append('turkishDescription', product.turkishDescription);
    formData.append('volume', product.volume);
    formData.append('volumeEntity', product.volumeEntity);
    formData.append('quantityInBox', product.quantityInBox);
    formData.append('grossWeight', product.grossWeight);
    formData.append('grossEntity', product.grossEntity);
    formData.append('unitPrice', product.unitPrice);
    formData.append('currency', product.currency);
    formData.append('imageUrl', product.image[0]);
    formData.append('stock', '0');
    formData.append('order', product.order);
    formData.append('categoryId', product.categoryId);
    formData.append('boxWidth', product.boxWidth);
    formData.append('boxLength', product.boxLength);
    formData.append('boxHeight', product.boxHeight);
    formData.append('boxEntity', product.boxEntity);
    formData.append('emptyBoxWeight', product.emptyBoxWeight);
    formData.append('publish', String(product.publish));

    this.productService.copy(formData, this.header)
      .subscribe((res: any) => {

        alert(product.title + '  Copied');

        this.gets(this.pageNumber, this.pageSize, this.textforsearch);

      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(err.error);

        }

      });

  }

}
