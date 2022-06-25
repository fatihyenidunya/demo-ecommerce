import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './model/category';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public baseUrl;
  public moduleName = 'category';
  public serverError = '';

  public nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.baseUrl = appConnections.api;
    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });


  gets() {
    return this.httpClient.get(this.baseUrl + 'api/' + this.moduleName);
  }

  getSubCategories(topCategoryId) {
    return this.httpClient.get(this.baseUrl + 'api/' + this.moduleName + '/getcubcategories/' + topCategoryId);
  }

  get(id) {
    return this.httpClient.get(this.baseUrl + 'api/' + this.moduleName + '/' + id);
  }

  save(data: Category) {
    return this.httpClient.post(this.baseUrl + 'api/' + this.moduleName + '/', data);
  }
  update(data: Category) {
    return this.httpClient.put(this.baseUrl + 'api/' + this.moduleName + '/' + data.id, data);
  }
  delete(data: Category) {
    return this.httpClient.delete(this.baseUrl + 'api/' + this.moduleName + '/' + data.id);
  }


  // nodejs start after that line

  saved(data: FormData) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data);
  }


  getsd(header) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getd(id, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  updated(id, data: FormData) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + id, data);
  }

  deleted(id) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'delete/' + id);
  }


  getSubCategoriesd(topCategoryId) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'getSubCategories/' + topCategoryId);
  }


  checkCategoryForProduct(categoryId, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'checkCategoryForProduct/' + categoryId, { headers: { 'Authorization': 'Bearer ' + header } });
  }

}
