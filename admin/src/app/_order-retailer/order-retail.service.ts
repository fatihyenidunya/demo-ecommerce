import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';


@Injectable({
  providedIn: 'root'
})
export class OrderRetailService {

  public route = 'order-retail';

  public status;
  nodejsApi;
  newProductBoxNumber = 0;
  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });

  // nodejs start after that line


  approveThis(data) {
    return this.httpClient.post(this.nodejsApi + '/' + this.route + '/approveThis/', data);
  }


  getOrderRetails() {
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/orders');
  }

  getQueryResults(page, pagesize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/orders?page=' + page + '&pagesize=' + pagesize + '&customer=' + customer + '&status=' + status + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear);
  }


  getGroupForProducts() {
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/ordergroupforproducts');
  }

  getOrderRetail(id) {
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/orders/' + id);
  }

  orderCanceld(orderId, userName) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/ordercancel/' + orderId + '/' + userName);
  }












}
