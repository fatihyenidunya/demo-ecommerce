import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';


@Injectable({
  providedIn: 'root'
})
export class WarehouseRetailService {


  public moduleName = 'order-retail';
  public serverError = '';
  public newProductBoxNumber;
  public status;
  nodejsApi;
  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });



  getWarehouseQueryResult(page, pagesize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/ordersforwarehouse?page=' + page + '&pagesize=' + pagesize + '&customer=' + customer + '&status=' + status + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear);
  }

  getQueryResult(page, pagesize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/orders?page=' + page + '&pagesize=' + pagesize + '&customer=' + customer + '&status=' + status + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear);
  }


  warehouseRetailerOperationd(data: FormData) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(this.nodejsApi + '/order/warehouseretaileroperation/', data);
  }

  updateCargoInformation(data: FormData) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/updatecargoinformation/', data);
  }

  get(id) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/ordersforwarehouse/' + id);
  }

  warehouseApproveThis(data) {
    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/warehouseApproveThis/', data);
  }

}
