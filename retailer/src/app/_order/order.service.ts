import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public moduleName = 'order-retail';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });





  getMyOrders(customerId, pageNumber, pageSize) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/myorders/' + customerId + '/' + pageNumber + '/' + pageSize);
  }


  orderCanceld(data) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/ordercustomercancel/', data);
  }

}
