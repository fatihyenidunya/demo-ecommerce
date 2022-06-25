import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './model/product';
import { AppConnections } from '../app.connections';
import { ProductQueryModel } from './model/productQueryModel';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public baseUrl;
  public moduleName = 'product';
  public serverError = '';
  public nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.baseUrl = appConnections.api;
    this.nodejsApi = appConnections.nodejsApi;
  }




  gets() {
    return this.httpClient.get(this.baseUrl + 'api/' + this.moduleName);
  }

  get(id) {
    return this.httpClient.get(this.baseUrl + 'api/' + this.moduleName + '/' + id);
  }

  save(data: Product) {
    return this.httpClient.post(this.baseUrl + 'api/' + this.moduleName + '/', data);
  }
  update(data: Product) {
    return this.httpClient.put(this.baseUrl + 'api/' + this.moduleName + '/' + data.id, data);
  }
  delete(data: Product) {
    return this.httpClient.delete(this.baseUrl + 'api/' + this.moduleName + '/' + data.id);
  }


  getQueryResult(data: ProductQueryModel) {
    return this.httpClient.post(this.baseUrl + 'api/' + this.moduleName + '/getqueryresult/', data);
  }


  makePdf() {
    return this.httpClient.get(this.baseUrl + 'api/' + this.moduleName + '/makepdf');

  }



  // nodejs start after that line

  saved(data: FormData, header) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  copy(data: FormData, header) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'copy', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getsd(page, pagesize, product, header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/list?page=' + page + '&pagesize=' + pagesize + '&product=' + product, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  
  getProductViaBarcode( barcode, header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/findbarcode?barcode=' + barcode , { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getProductStock(page, pagesize,  header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/stock?page=' + page + '&pagesize=' + pagesize, { headers: { 'Authorization': 'Bearer ' + header } });
  }
  getFindCustomerProducts(customerId, product, header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/findcustomerproducts?customerid=' + customerId + '&product=' + product, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getProducts(header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/getProducts', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getVolume(volume, header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/getProductForVolume/' + volume, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getsCustomerProductPrices(customerId, page, pagesize, product, header) {

    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/customerproductsearch?customerid=' + customerId + '&product=' + product, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  customerProductPrices(customerId, header) {

    return this.httpClient.get(this.nodejsApi + '/customer/customerproductprices/' + customerId, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getd(id, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }



  getProductStockLog(id, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'getProductStockLog/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  updated(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  updatePrice(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'updatePrice/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  saveColor(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'saveColor/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  deletePrice(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'deletePrice/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  updateColor(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'updateColor/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  updateSize(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'updateSize/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  deleteColor(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'deleteColor/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  updateStock(id, data, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'updateStock/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  uploadProductImage(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'uploadProductImage/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  deleteProductImage(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'deleteProductImage/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  deleted(id, header) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  // updateStock(data, header) {

  //   return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'updatestock', data, { headers: { 'Authorization': 'Bearer ' + header } });
  // }

  sendEMail(data) {

    return this.httpClient.post(this.nodejsApi + '/email/' + 'send', data);
  }


  saveCountryPrice(data: FormData, header) {
    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'savecountryprice/', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getCountryPrices(productId, header) {
    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'getcountryprices/' + productId, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getCountryPrice(priceId, header) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'getcountryprice/' + priceId, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  deleteCountryPrice(id, header) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'deletecountryprice/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  putCountryPrice(priceId, data, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'putcountryprice/' + priceId, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

}
