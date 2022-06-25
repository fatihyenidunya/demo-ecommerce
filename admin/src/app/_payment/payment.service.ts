import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public moduleName = 'payment';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }






  // getPayments(header) {
  //   return this.httpClient.get(this.nodejsApi + '/payment-retail/payments', { headers: { 'Authorization': 'Bearer ' + header } });
  // }


  getQueryResults(page, pagesize, customer, lastname, startmonth, startday, startyear, endmonth, endday, endyear) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/payment-retail/payments?page=' + page + '&pagesize=' + pagesize + '&customer=' + customer + '&lastname=' + lastname + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear);
  }



  getPayment(id, header) {

    return this.httpClient.get(this.nodejsApi + '/payment-retail/payment/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  makeCancelFromIyzico(data) {
    return this.httpClient.post(this.nodejsApi + '/payment-retail/iyzicocancel', data);
  }

  makeRefundFromIyzico(data) {
    return this.httpClient.post(this.nodejsApi + '/payment-retail/iyzicorefund', data);
  }


  getIPAddress() {
    return this.httpClient.get('http://api.ipify.org/?format=json');
  }

}
