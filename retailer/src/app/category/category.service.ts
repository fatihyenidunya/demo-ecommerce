import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public moduleName = 'order-retail';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('userToken') });



  getProductsByCategoryId(categoryId) {

    return this.httpClient.get(this.nodejsApi + '/product/productsByCategoryId/' + categoryId);
  }

  getProductsByTopCategory(country, topCategory) {

    return this.httpClient.get(this.nodejsApi + '/product/productsByTopCategory/' + country + '/' + topCategory);
  }


  getMyOrders(customerId, pageNumber, pageSize) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/myorders/' + customerId + '/' + pageNumber + '/' + pageSize);
  }

}
