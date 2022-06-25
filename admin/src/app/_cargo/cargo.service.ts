import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class CargoService {


  public route = 'cargoTracking';
  public serverError = '';
  public newProductBoxNumber;
  public status;
  nodejsApi;
  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });



  getQueryResult(page, pagesize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear, header) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/cargotracking?page=' + page + '&pagesize=' + pagesize + '&customer=' + customer + '&status=' + status + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  get(id) {
    return this.httpClient.get(this.nodejsApi + this.route + '/shipments/' + id);
  }


  getOrder(id) {
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/order/' + id);
  }

  getShipmentDetail(id) {
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/getshipmentdetail/' + id);
  }

  postShipmentDetail(data: FormData) {
    return this.httpClient.post(this.nodejsApi + '/' + this.route + '/postshipmentdetail/', data);
  }

}
