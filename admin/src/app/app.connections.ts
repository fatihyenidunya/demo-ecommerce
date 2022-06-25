import { Injectable } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './_product/model/product';
import { Message } from './messageModel';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from './message.service';

import { NgxIndexedDBService } from 'ngx-indexed-db';


@Injectable()
export class AppConnections {
  // public  authority ="http://269f59f4.ngrok.io/";
  // public  api="http://4ed59193.ngrok.io/";
  // public  adminWebSite ="http://localhost:4200";

  public nodejsApi;
  public socketIOUrl;

  public authority;
  // public  api="https://localhost:44336/";
  public adminWebSite;
  public cjApi;

  public products: Product[];
  public api;

  public countryNameLower;
  public countryName;

  public adminUserName;
  public message = new Message();

  subscription: Subscription;

  // public  api="https://localhost:44306/";

  // public website = 'http://localhost:4200';
  // public dealerApi = 'http://localhost:51341/';
  // public apiForPicture = 'http://localhost:51341/';

  public imageApi;

  totalWeight = 0;
  totalVolume = 0;
  grossWeightEntity;
  totalPiece = 0;
  totalPrice = 0;
  currency;

  newProductBoxNumber;

  newProductUnitNumber;

  showOkaySign: boolean[] = [];

  // PendingApproval = 'Pending Approval';
  // OrderApproved = 'Order Approved';
  // GettingReady = 'Getting Ready';
  // WaitingforShipmentApproval = 'Waiting for Shipment Approval';
  // ShipmentApproved = 'Shipment Approved';
  // ShipmentSuccessed = 'Shipment Successed';
  // OrderCanceled = 'Order Canceled';
  // CanceledWanted = 'Canceled Wanted';
  // CanceledApproved = 'Canceled Approved';
  // CanceledOkay = 'Canceled Okay';
  // ProductNumberChanged = 'Product Number Changed';
  // PromotionsChanged = 'Promotions Changed';
  // ReservationWanted = 'Reservation Wanted';
  // ReservationOkay = 'Reservation Okay';
  // PromotionAddedByWarehouse = 'Promotion Added By Warehouse';

  PendingApproval = 'Onay Bekliyor';
  OrderApproved = 'Siparis Onaylandi';
  GettingReady = 'Hazirlaniyor';
  WaitingforShipmentApproval = 'Gonderi Onayi Bekliyor';
  ShipmentApproved = 'Gonderi Onaylandi';
  ShipmentSuccessed = 'Gonderildi';
  OrderCanceled = 'Siparis Iptal Edildi';
  CanceledWanted = 'Iptal Isteniyor';
  CanceledApproved = 'Iptal Onaylandi';
  CanceledOkay = 'Iptal Tamamlandi';
  ProductNumberChanged = 'Urun Sayisi Degisti';
  PromotionsChanged = 'Promosyonlar Degisti';
  ReservationWanted = 'Rezervasyon Isteniyor';
  ReservationOkay = 'Reservasyon Tamamlandi';
  PromotionAddedByWarehouse = 'Promosyon Depo Tarafindan Eklendi';

  Percantage = 'Yuzdelik';
  FreeCargo = 'Ucretsiz Kargo';
  Amount = 'Fiyat';

  // netGsmApi = 'https://api.netgsm.com.tr/sms/send/get/?';
  // netGsmUserCode = '8503078888';
  // netGsmPassword = 'aslnkt34';
  // netGsmMsgHeader = 'ASIL GROUP';





  public userRole;
  public userRoles = JSON.parse('[{"role":"Warehouse"},{"role":"Operation"},{"role":"Seller"},{"role":"Admin"}]');
  // tslint:disable-next-line:max-line-length
  public months = JSON.parse('[{"month":"Ocak","number":1,"lastDay":31},{"month":"Şubat","number":2,"lastDay":29},{"month":"Mart","number":3,"lastDay":31},{"month":"Nisan","number":4,"lastDay":30},{"month":"Mayıs","number":5,"lastDay":31},{"month":"Haziran","number":6,"lastDay":30},{"month":"Temmuz","number":7,"lastDay":31},{"month":"Ağustos","number":8,"lastDay":31},{"month":"Eylül","number":9,"lastDay":30},{"month":"Ekim","number":10,"lastDay":31},{"month":"Kasım","number":11,"lastDay":30},{"month":"Aralık","number":12,"lastDay":31}]');
  public years = JSON.parse('[{"year":"2021"},{"year":"2022"},{"year":"2023"},{"year":"2024"},{"year":"2025"},{"year":"2026"},{"year":"2027"},{"year":"2028"},{"year":"2029"},{"year":"2030"}]');
  public reportTypes = JSON.parse('[{"type":"Aylik"},{"type":"Yillik"}]');
  public errorCodes = JSON.parse('[{"code":"All"},{"code":"0"},{"code":"403"},{"code":"500"},{"code":"422"}]');

  // countries = ['Canada', 'United Kingdom', 'Saudi Arabia'];

  countries = [
    'Afghanistan',
    'Åland Islands',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'British Indian Ocean Territory',
    'Brunei Darussalam',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Colombia',
    'Comoros',
    'Congo',
    'Congo, The Democratic Republic of the',
    'Cook Islands',
    'Costa Rica',
    'Cote DIvoire',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands (Malvinas)',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Guiana',
    'French Polynesia',
    'French Southern Territories',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard Island and Mcdonald Islands',
    'Holy See (Vatican City State)',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran, Islamic Republic Of',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, Democratic Peoples Republic of',
    'Korea, Republic of',
    'Kuwait',
    'Kyrgyzstan',
    'Lao Peoples Democratic Republic',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libyan Arab Jamahiriya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macao',
    'Macedonia, The Former Yugoslav Republic of',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia, Federated States of',
    'Moldova, Republic of',
    'Monaco',
    'Mongolia',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestinian Territory, Occupied',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russian Federation',
    'RWANDA',
    'Saint Helena',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Pierre and Miquelon',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia and Montenegro',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia and the South Sandwich Islands',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syrian Arab Republic',
    'Taiwan, Province of China',
    'Tajikistan',
    'Tanzania, United Republic of',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'United States Minor Outlying Islands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Viet Nam',
    'Virgin Islands, British',
    'Virgin Islands, U.S.',
    'Wallis and Futuna',
    'Western Sahara',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];


  deliveryTerms: string[] = ['EXV istanbul', 'ACF Bursa'];


  public currencies = JSON.parse('[{"currency":"USD","symbol":"$"},{"currency":"EUR","symbol":"€"},{"currency":"TL","symbol":"TL"},{"currency":"CHF","symbol":"CHF"},{"currency":"GBP","symbol":"£"},{"currency":"CAD","symbol":"CA$"},{"currency":"AED","symbol":"AED"},{"currency":"AUD","symbol":"AU$"},{"currency":"IRR","symbol":"IRR"},{"currency":"JPY","symbol":"¥"},{"currency":"KWD","symbol":"KD"}]');
  public selectedCurrency = 'USD';

  public volumeEntities = JSON.parse('[{"entity":"Not"},{"entity":"ML"},{"entity":"Gr"},{"entity":"Adet"}]');

  public stockEntities = JSON.parse('[{"entity":"Adet"},{"entity":"Kg"},{"entity":"ML"},{"entity":"Gr"}]');

  public grossEntities = JSON.parse('[{"entity":"Kg"}]');

  public sizeEntities = JSON.parse('[{"entity":"mm"},{"entity":"cm"}]');


  public selectedBoxSize = 'mm';

  public selectedUnitPrice = 'Euro';
  public selectedVolume = 'ML';
  public selectedGrossWeight = 'Kg';


  public volumesd = JSON.parse('[{"volume":"All"},{"volume":"Free"}]');
  public selectedVolumed = 'All';

  public productNumberInBasket;
  public pNumber = 0;

  public adminHeader;
  public website;




  constructor(private httpClient: HttpClient, private ngxIndexedDBService: NgxIndexedDBService, private messageService: MessageService) {




    // this.getCountries().subscribe(data => {

    //   this.countries = data;

    //   console.log(this.countries);
    // });


    // this.getCurrencies().subscribe(data => {

    //   console.log(data);
    // });

    //   this.nodejsApi = 'https://berberapi.nishman.com.tr/rest';
    // this.imageApi = 'https://berberapi.nishman.com.tr/rest';
    // this.socketIOUrl = 'https://berberapi.nishman.com.tr/';
    // this.website ='https://berberadmin.nishman.com.tr';

    // this.nodejsApi = 'http://rest.fatihyenidunya.com/rest';
    // this.imageApi = 'http://rest.fatihyenidunya.com/rest';
    // this.socketIOUrl = 'rest.fatihyenidunya.com/';
    // this.website ='admin.fatihyenidunya.com';

    this.nodejsApi = 'http://localhost:5500/rest';
    this.imageApi = 'http://localhost:5500/rest';
    this.socketIOUrl = 'http://localhost:5500/';
    this.website = 'http://localhost:4200';

    // this.nodejsApi = 'http://207.154.253.167/rest';
    // this.imageApi = 'http://207.154.253.167/rest';
    // this.website = 'http://207.154.253.167';
    // this.socketIOUrl = 'http://207.154.253.167/';

    this.subscription = this.messageService.getInfo().subscribe(info => {
      if (info) {



        this.totalVolume += Number(info.volume);
        this.totalWeight += Number(info.weight);
        this.grossWeightEntity = info.weightEntity;
        this.totalPiece = info.piece;
        this.totalPrice = info.price;
        this.currency = info.currency;
      }
    });

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.adminHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + user.oUserToken });

    });


  }


  public getCountries(): Observable<any> {

    return this.httpClient.get('../assets/json/countries.json');
  }

  public getCurrencies(): Observable<any> {

    return this.httpClient.get('../assets/json/currencies.json');
  }


}
