import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  // tslint:disable-next-line:object-literal-key-quotes
  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });




  addToCart(data: FormData) {
    return this.httpClient.post(this.nodejsApi + '/cart/addtocart', data);
  }

  getCart(customerId) {

    return this.httpClient.get(this.nodejsApi + '/cart/list/' + customerId);
  }

  getOutOfCart(customerId, cartId) {

    return this.httpClient.get(this.nodejsApi + '/cart/delete/' + customerId + '/' + cartId);
  }

  putUpdateCart(customerId, cartId, data) {

    return this.httpClient.put(this.nodejsApi + '/cart/updatecart/' + customerId + '/' + cartId, data);
  }

  giveAnOrder(data: FormData) {
  
    return this.httpClient.post(this.nodejsApi + '/cart/giveanorder', data);
  }

  postPayment(data: FormData) {
    return this.httpClient.post(this.nodejsApi + '/payment-retail/payment', data);
  }

  checkInstallments(data) {
    return this.httpClient.post(this.nodejsApi + '/payment-retail/iyzicoinstallmentchecking', data);
  }

  makePayment(data) {
    return this.httpClient.post(this.nodejsApi + '/payment-retail/iyzicopayment', data);
  }
  getIPAddress() {
    return this.httpClient.get("https://api.ipify.org/?format=json");
  }
}
