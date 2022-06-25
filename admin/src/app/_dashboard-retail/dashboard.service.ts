import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Custom } from './model/custom';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }



  getChats(header) {
    return this.httpClient.get(this.nodejsApi + '/chat/' + 'dashboard-list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getComments(header) {
    return this.httpClient.get(this.nodejsApi + '/comment/' + 'dashboard-list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getContacts(header) {
    return this.httpClient.get(this.nodejsApi + '/message/' + 'dashboard-list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getOrderRetails(header) {
    return this.httpClient.get(this.nodejsApi + '/order-retail/dashboard-list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getCounts(status, header) {

    return this.httpClient.get(this.nodejsApi + '/order-retail/dashboard/' + status, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getMonthlyRevenue(month, lastDay, year, header) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/order-retail/monthlyrevenue?month=' + month + '&lastDay=' + lastDay + '&year=' + year, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getDetailReport(type, year, month, monthNumber, lastDay, email, header) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/order-retail/detailreport?month=' + month + '&lastDay=' + lastDay + '&year=' + year + '&type=' + type + '&monthNumber=' + monthNumber + '&email=' + email, { headers: { 'Authorization': 'Bearer ' + header } });
  }

}
