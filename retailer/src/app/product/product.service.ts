import { Injectable } from '@angular/core';
import { AppConnections } from '../app.connections';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ProductService {


  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }



  getProduct(productId) {
    return this.httpClient.get(this.nodejsApi + '/product/list/' + productId);
  }

  getForIndividualProduct(country, productId) {
    return this.httpClient.get(this.nodejsApi + '/product/getForIndividualProduct/' + country + '/' + productId);
  }

  getProductByTitle(title) {
    return this.httpClient.get(this.nodejsApi + '/product/list/' + title);
  }

  getComments(productId) {
    return this.httpClient.get(this.nodejsApi + '/product/comments/' + productId);
  }

  postComment(data: FormData) {
    return this.httpClient.post(this.nodejsApi + '/product/newcomment/', data);
  }





}
