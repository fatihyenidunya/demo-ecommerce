import { Injectable } from '@angular/core';
import { AppConnections } from '../app.connections';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class HomeService {


  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }


  getSliders() {
    return this.httpClient.get(this.nodejsApi + '/slider/' + 'list');
  }


  getProductLatest(country) {


    return this.httpClient.get(this.nodejsApi + '/product/latest/' + country);
  }

  getCategoryProducts(category) {

    return this.httpClient.get(this.nodejsApi + '/product/categoryProducts/' + category);
  }

  getMainPageBlog() {

    return this.httpClient.get(this.nodejsApi + '/blog/mainpage/');
  }

  getMainPageVideo() {

    return this.httpClient.get(this.nodejsApi + '/video/mainpage/');
  }

  getMainpageCategories() {

    return this.httpClient.get(this.nodejsApi + '/category/getmainpagecategories/');
  }

}
