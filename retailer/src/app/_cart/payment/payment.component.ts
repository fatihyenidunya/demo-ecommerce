import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { ProfileService } from '../../_profile/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConnections } from '../../app.connections';
import { Order } from '../model/order';
import { Card } from '../model/card';
import { Billing } from '../model/billing';
import { Delivery } from '../model/delivery';
import { Payu } from '../model/payu';
import { stringify } from 'querystring';
import { MessageService } from '../../message.service';
import { Guid } from 'guid-typescript';
import { ErrorDialogService } from '../../__error/error-dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {


  public total = 0;
  public currentPage = 1;
  public pageSize = 50;

  order = new Order();

  note;
  contact;
  nodejsApi;
  cart;
  customerId;
  customer;
  grandTotal = 0;
  bigTotal = 0;
  currency;
  paymentInfo: string;
  card = new Card();
  billing = new Billing();
  delivery = new Delivery();
  payu = new Payu();
  clientIp = '';
  customerInfo;
  conversationId;
  basketItems: any = [];

  bankName;
  installmentPrices;

  contacts;
  billContacts;

  paymentPage = false;
  infoPage = true;


  public selectedInstalment = '1';
  public selectedMonth = '1';
  public selectedYear = '2020';

  public selectedAddress;

  public selectedBillAddress;

  selectedDeliveryName;
  selectedDeliverySurname;
  selectedDeliveryIdentityNumber;
  selectedDeliveryPhone;
  selectedDeliveryEmail;
  selectedDeliveryAddress1;
  selectedDeliveryAddress2;
  selectedDeliveryState;
  selectedDeliveryCity;
  selectedDeliveryZipCode;

  selectedBillName;
  selectedBillSurname;
  selectedBillIdentityNumber;
  selectedBillPhone;
  selectedBillEmail;
  selectedBillAddress1;
  selectedBillAddress2;
  selectedBillCity;
  selectedBillState;
  selectedBillZipCode;


  public instalments = JSON.parse('[{"instalment":"1"},{"instalment":"2"},{"instalment":"3"},{"instalment":"4"},{"instalment":"5"},{"instalment":"6"}]');
  public months = JSON.parse('[{"month":"1"},{"month":"2"},{"month":"3"},{"month":"4"},{"month":"5"},{"month":"6"},{"month":"7"},{"month":"8"},{"month":"9"},{"month":"10"},{"month":"11"},{"month":"12"}]');
  public years = JSON.parse('[{"year":"2020"},{"year":"2021"},{"year":"2022"},{"year":"2023"},{"year":"2024"},{"year":"2025"},{"year":"2026"},{"year":"2027"},{"year":"2028"},{"year":"2029"},{"year":"2030"},{"year":"2031"},{"year":"2032"},{"year":"2033"},{"year":"2034"},{"year":"2035"},{"year":"2036"}]');

  constructor(
    private cartService: CartService,
    private profileService: ProfileService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private messageService: MessageService,
    private errorService: ErrorDialogService,
    private ngxSpinnerService: NgxSpinnerService

  ) {


    this.customerId = localStorage.getItem('customerId');
    this.customer = localStorage.getItem('customerName');
    this.nodejsApi = appConnections.nodejsApi;

    this.conversationId = Guid.create();

    this.getCart();


  }

  ngOnInit() {


    this.getContacts();
    this.getClientIP();
    window.scrollTo(0, 0);

  }
  selectInstalment(instalment) {

    this.selectedInstalment = instalment;
    this.payu.SELECTED_INSTALLMENTS_NUMBER = instalment;
  }



  selectMonth(month) {

    this.selectedMonth = month;
    this.card.EXP_MONTH = this.selectedMonth;
  }



  selectYear(year) {

    this.selectedYear = year;
    this.card.EXP_YEAR = this.selectedYear;
  }


  selectDeliveryAddress(selection) {



    this.selectedAddress = selection;


    if (this.selectedAddress.name === 'new') {

      this.router.navigate(['/adres', this.customerId]);
    }
    else {

      this.selectedBillAddress = this.selectedAddress;

      this.selectedDeliveryName = selection.name;
      this.selectedDeliverySurname = selection.lastName;
      this.selectedDeliveryIdentityNumber = selection.identityNumber;
      this.selectedDeliveryPhone = selection.phone;
      this.selectedDeliveryEmail = selection.email;
      this.selectedDeliveryAddress1 = selection.addressOne;
      this.selectedDeliveryAddress2 = selection.addressTwo;
      this.selectedDeliveryState = selection.state;
      this.selectedDeliveryCity = selection.city;
      this.selectedDeliveryZipCode = selection.zipCode;

      this.selectedBillName = selection.name;
      this.selectedBillSurname = selection.lastName;
      this.selectedBillIdentityNumber = selection.identityNumber;
      this.selectedBillPhone = selection.phone;
      this.selectedBillEmail = selection.email;
      this.selectedBillAddress1 = selection.addressOne;
      this.selectedBillAddress2 = selection.addressTwo;
      this.selectedBillState = selection.state;
      this.selectedBillCity = selection.city;
      this.selectedBillZipCode = selection.zipCode;



      this.billing.name = this.selectedBillAddress.name;
      this.billing.lastName = this.selectedBillAddress.lastName;
      this.billing.email = this.selectedBillAddress.email;
      this.billing.phone = this.selectedBillAddress.phone;
      this.billing.addressOne = this.selectedBillAddress.addressOne;
      this.billing.addressTwo = this.selectedBillAddress.addressTwo;
      this.billing.zipCode = this.selectedBillAddress.zipCode;
      this.billing.city = this.selectedBillAddress.city;
      this.billing.countryCode = this.selectedBillAddress.countryCode;
      this.billing.state = this.selectedBillAddress.state;


      this.delivery.name = this.selectedAddress.name;
      this.delivery.lastName = this.selectedAddress.lastName;
      this.delivery.email = this.selectedAddress.email;
      this.delivery.phone = this.selectedAddress.phone;
      this.delivery.addressOne = this.selectedAddress.addressOne;
      this.delivery.addressTwo = this.selectedAddress.addressTwo;
      this.delivery.zipCode = this.selectedAddress.zipCode;
      this.delivery.city = this.selectedAddress.city;
      this.delivery.state = this.selectedAddress.state;
      this.delivery.countryCode = this.selectedAddress.countryCode;


    }
    console.log(JSON.stringify(this.selectedAddress));

  }

  selectBillAddress(selection) {

    this.selectedBillAddress = selection;

    if (this.selectedBillAddress.name === 'new') {

      this.router.navigate(['/adres', this.customerId]);
    }
    else {

      this.selectedBillName = selection.name;
      this.selectedBillSurname = selection.lastName;
      this.selectedBillIdentityNumber = selection.identityNumber;
      this.selectedBillPhone = selection.phone;
      this.selectedBillEmail = selection.email;
      this.selectedBillAddress1 = selection.addressOne;
      this.selectedBillAddress2 = selection.addressTwo;
      this.selectedBillState = selection.state;
      this.selectedBillCity = selection.city;
      this.selectedBillZipCode = selection.zipCode;


      this.billing.name = this.selectedBillAddress.name;
      this.billing.lastName = this.selectedBillAddress.lastName;
      this.billing.email = this.selectedBillAddress.email;
      this.billing.phone = this.selectedBillAddress.phone;
      this.billing.addressOne = this.selectedBillAddress.addressOne;
      this.billing.addressTwo = this.selectedBillAddress.addressTwo;
      this.billing.zipCode = this.selectedBillAddress.zipCode;
      this.billing.city = this.selectedBillAddress.city;
      this.billing.countryCode = this.selectedBillAddress.countryCode;
      this.billing.state = this.selectedBillAddress.state;

    }

  }

  getCart(): void {

    this.cartService.getCart(this.customerId).subscribe((res: any) => {
      this.cart = res.cart;

      let basketItem = {};


      this.cart.forEach(p => {

        this.bigTotal += p.totalPrice;
        this.currency = p.currency;
        p.readyUnitNumber = 0;
        p.productStatus = '';

        basketItem =
        {
          id: p.product._id,
          name: p.product.title,
          category1: p.product.categoryName,
          category2: '',
          itemType: 'PHYSICAL',
          price: p.totalPrice,
          unit: p.unit,
          unitPrice: p.unitPrice,
          unitPriceCurrency: p.currency,
          volume: p.volume,
          volumeEntity: p.volumeEntity
        };

        this.basketItems.push(basketItem);


      });

      this.grandTotal = this.bigTotal;


    }, err => {
      // this.showError(err.error);
    });

  }

  getCustomerInfo(): void {

    this.profileService.getCustomerInfo(this.customerId).subscribe((res: any) => {
      this.customerInfo = res.customerInfo;


      // console.log(this.cart);


    }, err => {
      // this.showError(err.error);
    });

  }

  getContacts(): void {

    const same = {
      name: {},
      addressName: {}
    };

    this.profileService.getContacts(this.customerId).subscribe((res: any) => {
      this.contacts = res.contacts;
      this.selectedAddress = res.contacts[0];



      this.selectedBillAddress = res.contacts[0];
      this.selectedDeliveryName = this.selectedAddress.name;
      this.selectedDeliverySurname = this.selectedAddress.lastName;
      this.selectedDeliveryIdentityNumber = this.selectedAddress.identityNumber;
      this.selectedDeliveryPhone = this.selectedAddress.phone;
      this.selectedDeliveryEmail = this.selectedAddress.email;
      this.selectedDeliveryAddress1 = this.selectedAddress.addressOne;
      this.selectedDeliveryAddress2 = this.selectedAddress.addressTwo;
      this.selectedDeliveryState = this.selectedAddress.state;
      this.selectedDeliveryCity = this.selectedAddress.city;
      this.selectedDeliveryZipCode = this.selectedAddress.zipCode;

      this.selectedBillName = this.selectedAddress.name;
      this.selectedBillSurname = this.selectedAddress.lastName;
      this.selectedBillIdentityNumber = this.selectedAddress.identityNumber;
      this.selectedBillPhone = this.selectedAddress.phone;
      this.selectedBillEmail = this.selectedAddress.email;
      this.selectedBillAddress1 = this.selectedAddress.addressOne;
      this.selectedBillAddress2 = this.selectedAddress.addressTwo;
      this.selectedBillState = this.selectedAddress.state;
      this.selectedBillCity = this.selectedAddress.city;
      this.selectedBillZipCode = this.selectedAddress.zipCode;



      this.billing.name = this.selectedBillAddress.name;
      this.billing.lastName = this.selectedBillAddress.lastName;
      this.billing.email = this.selectedBillAddress.email;
      this.billing.phone = this.selectedBillAddress.phone;
      this.billing.addressOne = this.selectedBillAddress.addressOne;
      this.billing.addressTwo = this.selectedBillAddress.addressTwo;
      this.billing.zipCode = this.selectedBillAddress.zipCode;
      this.billing.city = this.selectedBillAddress.city;
      this.billing.countryCode = this.selectedBillAddress.countryCode;
      this.billing.state = this.selectedBillAddress.state;


      this.delivery.name = this.selectedAddress.name;
      this.delivery.lastName = this.selectedAddress.lastName;
      this.delivery.email = this.selectedAddress.email;
      this.delivery.phone = this.selectedAddress.phone;
      this.delivery.addressOne = this.selectedAddress.addressOne;
      this.delivery.addressTwo = this.selectedAddress.addressTwo;
      this.delivery.zipCode = this.selectedAddress.zipCode;
      this.delivery.city = this.selectedAddress.city;
      this.delivery.state = this.selectedAddress.state;
      this.delivery.countryCode = this.selectedAddress.countryCode;

      this.contacts.push(same);
      this.billContacts = res.contacts;

      same.name = 'new';
      same.addressName = 'Yeni Adres Tan??mla';



    }, err => {
      // this.showError(err.error);
    });

  }

  getClientIP() {
    this.cartService.getIPAddress().subscribe((res: any) => {
      this.clientIp = res.ip;


    });
  }

  giveAnOrder(paymentStatus, paymentId): void {


    // console.log(this.billing);
    // console.log(this.delivery);
    this.ngxSpinnerService.show();

    this.order.note = this.note;

    this.order.customerId = this.customerId;
    this.order.customer = this.customer;
    this.order.grandTotal = this.grandTotal;
    this.order.currency = this.currency;
    this.order.billing = this.billing;
    this.order.delivery = this.delivery;
    this.order.cart = this.cart;

    const formData = new FormData();
    formData.append('customerId', this.order.customerId);
    formData.append('customer', this.order.customer);
    formData.append('billing', JSON.stringify(this.order.billing));
    formData.append('delivery', JSON.stringify(this.order.delivery));
    formData.append('grandTotal', String(this.order.grandTotal.toFixed(2)));
    formData.append('paymentStatus', paymentStatus);
    formData.append('paymentId', paymentId);
    formData.append('currency', this.order.currency);
    formData.append('note', this.order.note);
    formData.append('cart', JSON.stringify(this.order.cart));


    this.cartService.giveAnOrder(formData).subscribe((res: any) => {
      // alert(res.message);

      this.paymentPage = true;
      this.infoPage = false;
      this.ngxSpinnerService.hide();

      // this.messageService.sendMessage(0);

    }, err => {
    });
  }



  // sendForPayment(): void {

  //   const formData = new FormData();
  //   formData.append('cart', JSON.stringify(this.cart));
  //   formData.append('CC_OWNER', this.card.CC_OWNER);
  //   formData.append('CC_NUMBER', this.card.CC_NUMBER);
  //   formData.append('EXP_MONTH', this.card.EXP_MONTH);
  //   formData.append('EXP_YEAR', this.card.EXP_YEAR);
  //   formData.append('CC_CVV', this.card.CC_CVV);

  //   formData.append('BILL_FNAME', this.billing.BILL_FNAME);
  //   formData.append('BILL_LNAME', this.billing.BILL_LNAME);
  //   formData.append('BILL_EMAIL', this.billing.BILL_EMAIL);
  //   formData.append('BILL_PHONE', this.billing.BILL_PHONE);
  //   formData.append('BILL_FAX', this.billing.BILL_FAX);
  //   formData.append('BILL_ADDRESS', this.billing.BILL_ADDRESS);
  //   formData.append('BILL_ADDRESS2', this.billing.BILL_ADDRESS2);
  //   formData.append('BILL_ZIPCODE', this.billing.BILL_ZIPCODE);
  //   formData.append('BILL_CITY', this.billing.BILL_CITY);
  //   formData.append('BILL_COUNTRYCODE', this.billing.BILL_COUNTRYCODE);
  //   formData.append('BILL_STATE', this.billing.BILL_STATE);

  //   formData.append('DELIVERY_FNAME', this.delivery.DELIVERY_FNAME);
  //   formData.append('DELIVERY_LNAME', this.delivery.DELIVERY_LNAME);
  //   formData.append('DELIVERY_EMAIL', this.delivery.DELIVERY_EMAIL);
  //   formData.append('DELIVERY_PHONE', this.delivery.DELIVERY_PHONE);
  //   formData.append('DELIVERY_COMPANY', this.delivery.DELIVERY_COMPANY);
  //   formData.append('DELIVERY_ADDRESS', this.delivery.DELIVERY_ADDRESS);
  //   formData.append('DELIVERY_ADDRESS2', this.delivery.DELIVERY_ADDRESS2);
  //   formData.append('DELIVERY_ZIPCODE', this.delivery.DELIVERY_ZIPCODE);
  //   formData.append('DELIVERY_CITY', this.delivery.DELIVERY_CITY);
  //   formData.append('DELIVERY_STATE', this.delivery.DELIVERY_STATE);
  //   formData.append('DELIVERY_COUNTRYCODE', this.delivery.DELIVERY_COUNTRYCODE);

  //   formData.append('SELECTED_INSTALLMENTS_NUMBER', this.payu.SELECTED_INSTALLMENTS_NUMBER);
  //   // formData.append('ORDER_SHIPPING', this.payu.ORDER_SHIPPING);
  //   formData.append('ORDER_SHIPPING', '5');
  //   formData.append('CLIENT_IP', this.clientIp);

  //   this.cartService.postPayment(formData).subscribe((res: any) => {


  //     this.messageService.sendMessage(0);
  //   }, err => {
  //   });

  // }

  checkInstalments() {

    const formData = new FormData();
    formData.append('conversationId', this.conversationId);
    formData.append('binNumber', this.card.CC_NUMBER.substr(0, 6));
    formData.append('price', String(this.grandTotal));


    this.cartService.checkInstallments(formData).subscribe((res: any) => {

      this.installmentPrices = res.result.installmentDetails[0].installmentPrices;
      this.bankName = res.result.installmentDetails[0].bankName;

      console.log(res.result);


    }, err => {
    });
  }



  makePayment() {

    const paymentCard = {

      cardHolderName: this.card.CC_OWNER,
      cardNumber: this.card.CC_NUMBER,
      expireMonth: this.selectedMonth,
      expireYear: this.selectedYear,
      cvc: this.card.CC_CVV,
      registeredCard: '0'
    };



    const buyer = {
      id: localStorage.getItem('customerId'),
      name: this.selectedDeliveryName,
      surname: this.selectedDeliverySurname,
      gsmNumber: this.selectedDeliveryPhone,
      email: this.selectedDeliveryEmail,
      identityNumber: this.selectedDeliveryIdentityNumber,
      lastLoginDate: '',
      registrationDate: '',
      registrationAddress: this.selectedDeliveryAddress1 + this.selectedDeliveryAddress2,
      ip: '',
      city: this.selectedDeliveryCity,
      country: 'Turkey',
      zipCode: this.selectedDeliveryZipCode
    };

    const shippingAddress = {

      contactName: this.selectedDeliveryName + ' ' + this.selectedDeliverySurname,
      city: this.selectedDeliveryCity,
      country: 'Turkey',
      address: this.selectedDeliveryAddress1 + this.selectedDeliveryAddress2,
      zipCode: this.selectedDeliveryZipCode
    };

    const billingAddress = {
      contactName: this.selectedDeliveryName + ' ' + this.selectedDeliverySurname,
      city: this.selectedBillCity,
      country: 'Turkey',
      address: this.selectedBillAddress1 + this.selectedBillAddress2,
      zipCode: this.selectedBillZipCode
    };




    this.grandTotal = this.bigTotal;
    this.cartService.getIPAddress().subscribe((res: any) => {
      buyer.ip = res.ip;

      const formData = new FormData();
      formData.append('locale', 'TR');
      formData.append('conversationId', this.conversationId);
      formData.append('price', String(this.bigTotal.toFixed(2)));
      formData.append('paidPrice', String(this.grandTotal.toFixed(2)));
      formData.append('installment', String(this.selectedInstalment));
      formData.append('basketId', this.customerId);
      formData.append('customerId', this.customerId);
      formData.append('paymentCard', JSON.stringify(paymentCard));
      formData.append('buyer', JSON.stringify(buyer));
      formData.append('shippingAddress', JSON.stringify(shippingAddress));
      formData.append('billingAddress', JSON.stringify(billingAddress));
      formData.append('basketItems', JSON.stringify(this.basketItems));



      this.cartService.makePayment(formData).subscribe((result: any) => {
        console.log(result.result);

        if (result.result.sale.status === 'failure') {
          this.showError('??deme Ba??ar??s??z', result.result.sale.errorMessage);
        }

        if (result.result.sale.status === 'Paid') {

          this.messageService.sendMessage(0);
          this.giveAnOrder('Paid', result.result._id);

        }



      }, err => {

        this.showError('??deme Ba??ar??s??z', err);

      });

    });
  }

  public showError(title, message) {


    this.errorService.confirm(title, message)
      .then((confirmed: any) => {


      })
      .catch();


  }


  sample() {
    const data = {
      conversationId: '123456789',
      price: '1',
      paidPrice: '40',
      installment: '1',
      basketId: 'B67832',
      paymentCard: {
        cardHolderName: 'John Doe',
        cardNumber: this.card.CC_NUMBER,
        expireMonth: this.selectedMonth,
        expireYear: this.selectedYear,
        cvc: this.card.CC_CVV,
        registeredCard: '0'
      },
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@email.com',
        identityNumber: '74300864791',
        lastLoginDate: '2015-10-05 12:43:35',
        registrationDate: '2013-04-21 15:12:09',
        registrationAddress: 'Nidakule G??ztepe, Merdivenk??y Mah. Bora Sok. No:1',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule G??ztepe, Merdivenk??y Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      billingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule G??ztepe, Merdivenk??y Mah. Bora Sok. No:1',
        zipCode: '34742'
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Binocular',
          category1: 'Collectibles',
          category2: 'Accessories',
          itemType: 'PHYSICAL',
          price: '0.3'
        },
        {
          id: 'BI102',
          name: 'Game code',
          category1: 'Game',
          category2: 'Online Game Items',
          itemType: 'VIRTUAL',
          price: '0.5'
        },
        {
          id: 'BI103',
          name: 'Usb',
          category1: 'Electronics',
          category2: 'Usb / Cable',
          itemType: 'PHYSICAL',
          price: '0.2'
        }
      ]
    };
  }

}
