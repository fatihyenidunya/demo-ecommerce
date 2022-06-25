import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Product } from '../model/product';
import { Category } from '../../_category/model/category';
import { Size } from '../model/size';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';


import { CategoryService } from '../../_category/category.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { throwError } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CountryPrice } from '../model/countryPrice';



interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  companies;
  selectedProductCompany;

  priceUpdateBtnDisabled = true;
  priceDeleteBtnDisabled = true;
  priceSaveBtnDisabled = true;

  pricePageDisabled = false;

  sizes = [];
  size = {
    volume: '',
    volumeEntity: '',
    barberSellingPrice: '',
    barberSellingPriceCurrency: '',
    listPrice: '',
    listPriceCurrency: '',
    salePrice: '',
    salePriceCurrency: '',
    stock: 0,
    stockCode: '',
    stockStatus: false
  }

  colors = [];
  renk = {
    color: '',
    volume: '',
    volumeEntity: '',
    barberSellingPrice: '',
    barberSellingPriceCurrency: '',
    listPrice: '',
    listPriceCurrency: '',
    salePrice: '',
    salePriceCurrency: '',
    stock: 0,
    stockCode: '',
    stockStatus: false
  }

  subCategories;
  public selectedSubCategory;
  public selectedCategory;


  constructor(private productService: ProductService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private confirmationService: ConfirmationDialogService,
    private ngxIndexedDBService: NgxIndexedDBService,
    private categoryService: CategoryService,




  ) {



    this.thisModule = this.productService.moduleName;
    this.nodejsApi = this.apiConnections.nodejsApi;
    this.imageApi = apiConnections.imageApi;
    this.countries = apiConnections.countries;
  }


  stockFieldHide = false;
  public disable = true;
  public countryPriceDisable = true;
  public isEdit = false;
  public uploadPath = 'product';
  public thisModule;
  public countryProductPrices;
  public selectedPriceCountry;
  public picUrl;
  public info = '';
  public product = new Product();
  public countryPrice = new CountryPrice();
  counter: number;
  public selectedCountry;
  public countries;
  public volumes;
  public unitPrices;
  public grossWeights;
  public quantityInBoxes;
  public boxSizes;
  public categories = [];

  countryProductPriceEdit = false;

  public selectedVolume;
  public selectedUnitPrice;
  public selectedGrossWeight;
  public selectedQuantityInBox;



  selectedColorVolume;
  selectedColorCurrency;

  public currencies = this.apiConnections.currencies;
  public volumeEntities = this.apiConnections.volumeEntities;
  public grossEntities = this.apiConnections.grossEntities;
  public sizeEntities = this.apiConnections.sizeEntities;
  public selectedBoxSize = this.apiConnections.selectedBoxSize;
  public selectedCurrency;
  public selectedPriceCurrency;
  productId;
  productTitle = '';
  image: any;
  priceOfSizeCheckboxChecked = true;

  countryProductPriceId;

  fileToUpload: File = null;
  imageFile: File = null;
  nodejsApi;

  imagePageHidden = true;
  productPageHidden = false;
  pricePageHidden = true;
  colorPageHidden = true;

  imagePageBtnHidden = true;
  productPageBtnHidden = true;
  pricePageBtnHidden = true;
  productShipmentLogHidden = true;
  colorPageBtnHidden = false;




  productHistory: any;
  productShipmentHistory: any;

  colorHeaderHidden = true;
  priceHeaderHidden = true;
  imageHeaderHidden = true;
  productHeaderHidden = false;

  stockLogHeaderHidden = true;
  shipmentLogHeaderHidden = true;
  cargoPriceDisable = true;
  productStockLogHidden = true;



  salePriceDisabled = false;
  listPriceDisabled = false;

  sizeDisabled = false;
  sizeHeaderDisabled = true;

  math: any;

  header;

  imageApi;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };


  ngOnInit() {
    this.selectedUnitPrice = this.apiConnections.selectedUnitPrice;
    this.selectedVolume = this.apiConnections.selectedVolume;
    this.selectedGrossWeight = this.apiConnections.selectedGrossWeight;
    this.math = Math;

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      this.getCategories(this.header);

      this.prepare(this.header);

      this.selectedVolume = 'ML';
      this.selectedColorVolume = 'ML';
      this.renk.volumeEntity = 'ML';
      this.selectedCurrency = 'TL';
      this.selectedColorCurrency = 'TL';


    });
  }


  selectProductCompany(selected) {
    this.product.company = selected;

  }



  getCategories(header): void {

    this.categoryService.getsd(header).subscribe((res: any) => {
      this.categories = res.categories;


    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  selectCurrency(currency) {

    this.size.barberSellingPriceCurrency = currency;
    this.renk.barberSellingPriceCurrency = currency;
  }

  selectPriceCurrency(currency) {

  }


  prepare(header) {
    this.alertReset();

    this.counter = 3;
    this.productId = this.route.snapshot.params['id'];



    if (this.productId !== '0') {
      this.productService.getd(this.productId, header).subscribe((res: any) => {
        this.product = res.product;
        this.sizes = this.product.sizes;
        this.colors = this.product.colors;
        this.productHistory = res.productHistory;
        this.productShipmentHistory = res.productShipmentHistory;
        this.selectedProductCompany = res.product.company;


        this.checkCategoryForProduct(this.product.categoryId);

        this.stockFieldHide = true;

        if (this.product.sizes.length !== 0) {
          this.sizeHeaderDisabled = false;
        }

     
        this.productTitle = this.product.turkishTitle;

        if (this.product.freeCargo === false) {
          this.cargoPriceDisable = false;
        }


        this.imagePageBtnHidden = false;
        this.productPageBtnHidden = true;
        this.pricePageBtnHidden = false;


      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

    } else {
      this.disable = false;
      this.stockFieldHide = false;
      this.cleanData();
    }
  }

  edit(): void {
    this.disable = false;

    this.isEdit = true;

  }

  cleanData() {


    this.product.title = '';
    this.product.description = '';
    this.product.imageUrl = '';

    this.product.volume = '';
    this.product.quantityInBox = '';
    this.product.grossWeight = '';
    this.product.unitPrice = '';
    this.product.stock = 0;
    this.selectedCurrency = 'EUR';
    this.selectedPriceCurrency = 'TL';
    this.selectedVolume = 'ML';
    this.selectedColorVolume = 'ML';
    this.product.boxEntity = 'mm';
    this.product.boxHeight = '';
    this.product.boxWidth = '';
    this.product.boxLength = '';
    this.product.emptyBoxWeight = '';
    this.product.turkishTitle = '';
    this.product.turkishDescription = '';
    this.product.currency = this.selectedCurrency;
    this.product.volumeEntity = this.selectedVolume;
    this.product.grossEntity = this.selectedGrossWeight;

  }

  delete(): void {

    this.productService.deleted(this.productId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../', this.thisModule]);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  imagePage() {
    this.imagePageHidden = false;
    this.productPageHidden = true;
    this.pricePageHidden = true;
    this.productStockLogHidden = true;
    this.productShipmentLogHidden = true;
    this.colorPageHidden = true;

    this.imageHeaderHidden = false;
    this.productHeaderHidden = true;
    this.priceHeaderHidden = true;
    this.stockLogHeaderHidden = true;
    this.shipmentLogHeaderHidden = true;
    this.colorHeaderHidden = true;


    this.imagePageBtnHidden = true;
    this.productPageBtnHidden = false;
    this.pricePageBtnHidden = false;
  }

  productPage() {
    this.imagePageHidden = true;
    this.productPageHidden = false;
    this.pricePageHidden = true;
    this.productStockLogHidden = true;
    this.productShipmentLogHidden = true;
    this.colorPageHidden = true;

    this.imageHeaderHidden = true;
    this.productHeaderHidden = false;
    this.priceHeaderHidden = true;
    this.stockLogHeaderHidden = true;
    this.shipmentLogHeaderHidden = true;
    this.colorHeaderHidden = true;

    this.imagePageBtnHidden = false;
    this.productPageBtnHidden = true;
    this.pricePageBtnHidden = false;


  }


  productStockLogPage() {
    this.imagePageHidden = true;
    this.productPageHidden = true;
    this.pricePageHidden = true;
    this.productStockLogHidden = false;
    this.productShipmentLogHidden = true;
    this.colorPageHidden = true;

    this.imageHeaderHidden = true;
    this.productHeaderHidden = true;
    this.priceHeaderHidden = true;
    this.stockLogHeaderHidden = false;
    this.shipmentLogHeaderHidden = true;
    this.colorHeaderHidden = true;
  }



  productShipmentLogPage() {
    this.imagePageHidden = true;
    this.productPageHidden = true;
    this.pricePageHidden = true;
    this.productStockLogHidden = true;
    this.productShipmentLogHidden = false;
    this.colorPageHidden = true;

    this.imageHeaderHidden = true;
    this.productHeaderHidden = true;
    this.priceHeaderHidden = true;
    this.stockLogHeaderHidden = true;
    this.shipmentLogHeaderHidden = false;
    this.colorHeaderHidden = true;
  }

  colorPage() {
    this.imagePageHidden = true;
    this.productPageHidden = true;
    this.pricePageHidden = true;
    this.colorPageHidden = false;

    this.productStockLogHidden = true;
    this.productShipmentLogHidden = true;

    this.imageHeaderHidden = true;
    this.productHeaderHidden = true;
    this.priceHeaderHidden = true;
    this.stockLogHeaderHidden = true;
    this.shipmentLogHeaderHidden = true;
    this.colorHeaderHidden = false;

    this.imagePageBtnHidden = false;
    this.productPageBtnHidden = false;
    this.pricePageBtnHidden = false;
    this.selectedPriceCurrency = 'TL';

    this.renk.barberSellingPriceCurrency = this.selectedPriceCurrency;

  }



  pricePage() {
    this.imagePageHidden = true;
    this.productPageHidden = true;
    this.pricePageHidden = false;
    this.productStockLogHidden = true;
    this.productShipmentLogHidden = true;
    this.colorPageHidden = true;

    this.imageHeaderHidden = true;
    this.productHeaderHidden = true;
    this.priceHeaderHidden = false;
    this.stockLogHeaderHidden = true;
    this.shipmentLogHeaderHidden = true;
    this.colorHeaderHidden = true;

    this.imagePageBtnHidden = false;
    this.productPageBtnHidden = false;
    this.pricePageBtnHidden = false;
    this.selectedPriceCurrency = 'TL';
    this.product.priceCurrency = this.selectedPriceCurrency;
    this.size.barberSellingPriceCurrency = this.selectedPriceCurrency;
    this.renk.barberSellingPriceCurrency = this.selectedPriceCurrency;
    this.size.volumeEntity = this.selectedVolume;


    this.salePriceDisabled = true;
    this.listPriceDisabled = true;
    if (this.product.sizes.length === 0) {
      this.priceOfSizeCheckboxChecked = false;

      this.listPriceDisabled = false;
      this.salePriceDisabled = false;


    } else {


      this.priceOfSizeCheckboxChecked = true;

    }


    if (this.product.size !== undefined && this.product.size !== 'undefined' && this.product.size !== '') {
      this.priceOfSizeCheckboxChecked = false;
    }


  }

  openCargoPrice() {
    this.cargoPriceDisable = !this.cargoPriceDisable;
  }

  priceOfSize(event) {


    if (this.priceOfSizeCheckboxChecked === true) {

      if (this.product.size !== undefined && this.product.size !== 'undefined' && this.product.size !== '') {


        this.salePriceDisabled = true;
        this.listPriceDisabled = true;
        this.sizeDisabled = false;
        this.sizeHeaderDisabled = !this.sizeHeaderDisabled;


        for (const size of this.product.size.split(',')) {

          const priceOfSize = {
            size: {},
            listPrice: {},
            salePrice: {}
          };


          priceOfSize.size = size;
          priceOfSize.listPrice = 0;
          priceOfSize.salePrice = 0;


          this.product.sizes.push(priceOfSize);

          this.sizeHeaderDisabled = false;

        }

      } else {

        this.product.size = '';
        this.showError('Ürün Bilgisi ekranında SIZE girmelisiniz');
        this.imagePageHidden = true;
        this.productPageHidden = false;
        this.pricePageHidden = true;


        this.imagePageBtnHidden = false;
        this.productPageBtnHidden = true;
        this.pricePageBtnHidden = false;


      }


    } else {

      this.product.sizes = [];

      if (this.product.size !== undefined) {

        this.sizeHeaderDisabled = true;
        this.salePriceDisabled = false;
        this.listPriceDisabled = false;

      }


    }


  }

  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }
  public confirmToDelete() {

    this.confirmationService.confirm(this.product.title, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.delete();
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  public showInfo() {

    if (this.isEdit === true) {
      this.alerts.push({
        type: 'info',
        message: 'The data has been updated',
      });
    } else {
      this.alerts.push({
        type: 'success',
        message: 'The data was saved succesfully',
      });
    }
    this.simpleTimer.newTimer('3sec', 1, false);
    this.simpleTimer.subscribe('3sec', () => this.callback());
  }

  private closeInfo() {
    if (this.isEdit === true) {
      this.alerts.splice(this.alerts.indexOf({
        type: 'info',
        message: 'The data has been updated',
      }), 1);
    } else {
      this.alerts.splice(this.alerts.indexOf({
        type: 'success',
        message: 'The data was saved succesfully',
      }), 1);
    }
  }

  alertClose(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  alertReset() {
    this.alerts = Array.from(ALERTS);
    this.counter = 0;
  }
  callback() {
    this.counter--;
    if (this.counter === 0) {
      this.simpleTimer.delTimer('3sec');
      this.counter = 3;

      if (this.isEdit === true) {
        this.router.navigate(['../../', this.thisModule]);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }
  selectCountry(selected) {

    // this.shop.countryNameLower = selected;

  }

  selectCategory(categoryId) {
    this.product.categoryId = categoryId;
  

    this.getSubcategories(categoryId);


  }

  getSubcategories(categoryId) {

    this.categoryService.getSubCategoriesd(categoryId).subscribe((res: any) => {
      this.subCategories = res.categories;

    }, err => {
      if (err.status === 401) {

      } else {
        alert(JSON.stringify(err));
      }
    });

  }


  checkCategoryForProduct(categoryId) {

    this.categoryService.checkCategoryForProduct(categoryId, this.header).subscribe((res: any) => {
     

     
      if (res.isTopCategory === false) {
        this.subCategories = res.subCategories;
        this.selectedCategory = res.topCategory._id;
        this.selectedSubCategory = res.category._id;

      
    
      }else{
        this.selectedCategory = res.category._id;
      
      }




    }, err => {
      if (err.status === 401) {

      } else {
        alert(JSON.stringify(err));
      }
    });


  }

  selectSubCategory(subCategoryId) {
    this.product.categoryId = subCategoryId;
 



  }

  selectVolume(selected) {

    this.size.volumeEntity = selected;
  }

  selectColorVolume(selected) {

    this.renk.volumeEntity = selected;
  }


  selectUnitPrice(selected) {

    this.product.unitPrice = selected;

  }
  selectGrossWeight(selected) {
    this.product.grossEntity = selected;
  }
  selectQuantityInBox(selected) {
    this.product.quantityInBox = selected;
  }

  selectBoxSize(selected) {

    this.product.boxEntity = selected;
  }

  handleFileInput(files) {
    console.log(files.target.files[0]);

    this.fileToUpload = files.target.files[0];
  }




  OnSubmit(form: NgForm) {



    const formData = new FormData();
    formData.append('title', this.product.title);
    formData.append('turkishTitle', this.product.turkishTitle);
    formData.append('description', this.product.description);
    formData.append('metaDescription', this.product.metaDescription);
    // formData.append('color', this.product.color);
    // formData.append('productCode', this.product.productCode);
    // formData.append('size', this.product.size);
    formData.append('turkishDescription', this.product.turkishDescription);
    // formData.append('volume', this.product.volume);
    // formData.append('volumeEntity', this.product.volumeEntity);
    // formData.append('quantityInBox', this.product.quantityInBox);
    // formData.append('grossWeight', this.product.grossWeight);
    // formData.append('grossEntity', this.product.grossEntity);
    // formData.append('unitPrice', this.product.unitPrice);
    // formData.append('currency', this.product.currency);
    // formData.append('listPrice', String(this.product.listPrice));
    // formData.append('salePrice', String(this.product.salePrice));
    // formData.append('priceCurrency', this.product.priceCurrency);
    // formData.append('stock', String(this.product.stock));
    formData.append('categoryId', this.product.categoryId);
    // formData.append('boxWidth', this.product.boxWidth);
    // formData.append('boxLength', this.product.boxLength);
    // formData.append('boxHeight', this.product.boxHeight);
    // formData.append('boxEntity', this.product.boxEntity);
    formData.append('order', String(this.product.order));
    formData.append('mainPage', String(this.product.mainPage));
    formData.append('emptyBoxWeight', this.product.emptyBoxWeight);
    formData.append('company', this.product.company);
    formData.append('barcode', this.product.barcode);
    // if (this.product.publish === undefined || 'undefined') {
    //   formData.append('publish', String(false));

    // } else {
      formData.append('publish', String(this.product.publish));
    // }

    // formData.append('freeCargo', String(this.product.freeCargo));


    // if (this.fileToUpload !== null) {
    //   formData.append('image', this.fileToUpload);
    // } else {
    //   formData.append('image', this.product.imageUrl);
    // }


    if (this.productId !== '0') {
      this.productService.updated(this.productId, formData, this.header)
        .subscribe((res: any) => {
          this.disable = true;

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    } else {
      this.productService.saved(formData, this.header)
        .subscribe((res: any) => {

          this.productId = res.productId;
          this.productTitle = res.productTitle;

          this.pricePageBtnHidden = false;
          this.imagePageBtnHidden = false;
          this.disable = true;



        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    }
  }


  handleImageFile(files) {
    console.log(files.target.files[0]);
    this.imageFile = files.target.files[0];
    const formData = new FormData();
    formData.append('productId', this.product._id);
    formData.append('image', this.imageFile);

    this.productService.uploadProductImage(this.productId, formData, this.header)
      .subscribe((res: any) => {
        this.product = res.product;



      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }

  deleteProductImage(productId, imageIndex) {

    const formData = new FormData();
    formData.append('imageIndex', imageIndex);

    this.productService.deleteProductImage(productId, formData, this.header)
      .subscribe((res: any) => {
        this.product = res.product;




      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }


  saveColor() {

    this.renk.listPriceCurrency = this.renk.barberSellingPriceCurrency;
    this.renk.salePriceCurrency = this.renk.barberSellingPriceCurrency;




    const formData = new FormData();
    formData.append('color', JSON.stringify(this.renk));



    this.productService.updateColor(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.colors = res.product.colors;


        this.renk.color = '';
        this.renk.volume = '';

        this.renk.barberSellingPrice = '';

        this.renk.listPrice = '';

        this.renk.salePrice = '';

        this.renk.stock = 0;
        this.renk.stockCode = '';
        this.renk.stockStatus = false;


      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }

  deleteColor(index) {

    const formData = new FormData();
    formData.append('index', String(index));

    this.productService.deleteColor(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.colors = res.product.colors;

        // this.salePriceDisabled = true;
        // this.listPriceDisabled = true;
        // this.cargoPriceDisable = true;
        // this.sizeDisabled = true;

      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }





  getColor(color) {

    this.renk = color;
  }

  getSize(size) {
    this.size = size;
  }


  updateSize() {


    this.size.listPriceCurrency = this.size.barberSellingPriceCurrency;
    this.size.salePriceCurrency = this.size.barberSellingPriceCurrency;

    const formData = new FormData();
    formData.append('size', JSON.stringify(this.size));

    this.productService.updateSize(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.sizes = res.product.sizes;

        this.size.volume = '';
        this.size.barberSellingPrice = '';
        this.size.listPrice = '';
        this.size.salePrice = '';
        this.size.stock = 0;
        this.size.stockCode = '';
        this.size.stockStatus = false;


      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });



  }

  updateColor() {


    this.renk.listPriceCurrency = this.renk.barberSellingPriceCurrency;
    this.renk.salePriceCurrency = this.renk.barberSellingPriceCurrency;

    const formData = new FormData();
    formData.append('color', JSON.stringify(this.renk));

    this.productService.updateColor(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.colors = res.product.colors;


        this.renk.color = '';
        this.renk.volume = '';

        this.renk.barberSellingPrice = '';

        this.renk.listPrice = '';

        this.renk.salePrice = '';

        this.renk.stock = 0;
        this.renk.stockCode = '';
        this.renk.stockStatus = false;


      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });



  }



  savePrice() {

    this.size.listPriceCurrency = this.size.barberSellingPriceCurrency;
    this.size.salePriceCurrency = this.size.barberSellingPriceCurrency;

    this.sizes.push(this.size);
    const formData = new FormData();
    formData.append('size', JSON.stringify(this.size));

    this.productService.updatePrice(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.sizes = res.product.sizes;



        this.size.volume = '';

        this.size.barberSellingPrice = '';

        this.size.listPrice = '';

        this.size.salePrice = '';

        this.size.stock = 0;
        this.size.stockCode = '';
        this.size.stockStatus = false;

      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }


  saveNewColor() {
    this.renk.listPriceCurrency = this.renk.barberSellingPriceCurrency;
    this.renk.salePriceCurrency = this.renk.barberSellingPriceCurrency;

    const formData = new FormData();
    formData.append('color', JSON.stringify(this.renk));

    this.productService.saveColor(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.colors = res.product.colors;


        this.renk.color = '';
        this.renk.volume = '';

        this.renk.barberSellingPrice = '';

        this.renk.listPrice = '';

        this.renk.salePrice = '';

        this.renk.stock = 0;
        this.renk.stockCode = '';
        this.renk.stockStatus = false;

      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }

  deletePrice(index) {

    const formData = new FormData();
    formData.append('index', String(index));

    this.productService.deletePrice(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.sizes = res.product.sizes;

        // this.salePriceDisabled = true;
        // this.listPriceDisabled = true;
        // this.cargoPriceDisable = true;
        // this.sizeDisabled = true;

      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });




  }


  updatePrice() {



    const formData = new FormData();
    formData.append('freeCargo', String(this.product.freeCargo));
    formData.append('priceCurrency', this.product.priceCurrency);
    formData.append('sizes', JSON.stringify(this.product.sizes));

    if (this.product.freeCargo === true) {

      this.product.cargoPrice = 0;
    }

    formData.append('cargoPrice', String(this.product.cargoPrice));

    if (this.priceOfSizeCheckboxChecked === true) {

      this.product.listPrice = 0;
      this.product.salePrice = 0;
    }

    formData.append('listPrice', String(this.product.listPrice));
    formData.append('salePrice', String(this.product.salePrice));

    this.productService.updatePrice(this.productId, formData, this.header)
      .subscribe((res: any) => {

        this.salePriceDisabled = true;
        this.listPriceDisabled = true;
        this.cargoPriceDisable = true;
        this.sizeDisabled = true;

      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }


  sendEmail() {
    const formData = new FormData();
    formData.append('owner', 'test');
    formData.append('to', 'fatih_yenidunya@hotmail.com');
    formData.append('subject', 'mail sender is working');
    formData.append('text', 'this mailis important for me so thank you !');

    this.productService.sendEMail(formData)
      .subscribe((res: any) => {
        this.showInfo();
      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });
  }


  countryPriceDelete(): void {

    this.productService.deleteCountryPrice(this.countryProductPriceId, this.header).subscribe((res: any) => {
      this.getCountryProductPrices(this.header);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  public countryPriceConfirmToDelete() {

    this.confirmationService.confirm(this.countryPrice.country, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.countryPriceDelete();
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }



  public confirmDeleteColor(color, index) {

    this.confirmationService.confirm(color.color, 'Silmek istediğine eminmisin?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.deleteColor(index);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  public confirmDeleteSize(size, index) {

    this.confirmationService.confirm(size.volume + ' ' + size.volumeEntity, 'Silmek istediğine eminmisin?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.deletePrice(index);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  countryPriceEdit() {
    this.countryPriceDisable = false;
    this.countryProductPriceEdit = true;
    this.priceSaveBtnDisabled = false;
    this.priceDeleteBtnDisabled = true;

  }



  selectCountryForPrice(country) {

    this.countryPrice.country = country;
  }

  selectCountryPriceCurrency(currency) {

    this.countryPrice.currency = currency;

  }

  OnCountryPriceSubmit(form: NgForm) {

    const formData = new FormData();
    formData.append('productId', this.product._id);
    formData.append('product', this.product.title);
    formData.append('order', String(this.product.order));
    formData.append('categoryNameLower', this.product.categoryNameLower);
    formData.append('country', this.countryPrice.country);
    formData.append('listPrice', String(this.countryPrice.listPrice));
    formData.append('salePrice', String(this.countryPrice.salePrice));
    formData.append('currency', this.countryPrice.currency);

    if (this.countryPrice.cargoFee !== 0) {
      formData.append('cargoFee', String(this.countryPrice.cargoFee));
    }


    formData.append('mainPage', String(this.countryPrice.mainPage));
    formData.append('freeCargo', String(this.countryPrice.freeCargo));

    if (this.countryProductPriceEdit === false) {

      this.productService.saveCountryPrice(formData, this.header)
        .subscribe((res: any) => {

          this.salePriceDisabled = true;
          this.listPriceDisabled = true;
          this.cargoPriceDisable = true;
          this.sizeDisabled = true;

          this.getCountryProductPrices(this.header);

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    } else {

      this.productService.putCountryPrice(this.countryPrice._id, formData, this.header)
        .subscribe((res: any) => {

          this.salePriceDisabled = true;
          this.listPriceDisabled = true;
          this.cargoPriceDisable = true;
          this.sizeDisabled = true;

          this.getCountryProductPrices(this.header);

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    }


    this.countryPriceDisable = !this.countryPriceDisable;
  }


  getCountryProductPrices(header): void {



    this.productService.getCountryPrices(this.productId, header).subscribe((res: any) => {
      this.countryProductPrices = res.prices;



    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  getPrice(priceId): void {


    this.countryProductPriceId = priceId;


    this.productService.getCountryPrice(priceId, this.header).subscribe((res: any) => {
      this.countryPrice = res.price;

      this.selectedPriceCountry = res.price.country;
      this.selectedPriceCurrency = res.price.currency;
      this.priceUpdateBtnDisabled = false;
      this.priceDeleteBtnDisabled = false;

      this.countryProductPriceId = res.price._id;

    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  newCountryPrice() {
    this.countryPrice.salePrice = 0;
    this.countryPrice.listPrice = 0;
    this.countryPrice.currency = 'TL';
    this.selectedPriceCurrency = 'TL';

    this.countryPrice.country = 'Turkey';
    this.selectedPriceCountry = 'Turkey';

    this.countryPriceDisable = !this.countryPriceDisable;

    this.countryProductPriceEdit = false;

  }


}




