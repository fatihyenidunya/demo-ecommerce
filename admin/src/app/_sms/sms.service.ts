import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class SmsService {


  public route = 'sms';
  public serverError = '';
  public newProductBoxNumber;
  public status;
  nodejsApi;
  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });


  postNewSms(data, header) {
    return this.httpClient.post(this.nodejsApi + '/' + this.route + '/newSms/', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getQueryResult(page, pagesize, customer, status, startmonth, startday, startyear, endmonth, endday, endyear, header) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/smsList?page=' + page + '&pagesize=' + pagesize + '&customer=' + customer + '&status=' + status + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear, { headers: { 'Authorization': 'Bearer ' + header } });
  }



  getSmsSettings(header) {
    return this.httpClient.get(this.nodejsApi + '/' +this.route + '/list', { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getSmsSetting(id, header) {
    return this.httpClient.get(this.nodejsApi + '/' + this.route + '/list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  saveSmsSetting(data, header) {

    return this.httpClient.post(this.nodejsApi + '/' + this.route + '/new', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  updateSmsSetting(id, data, header) {
  
    return this.httpClient.put(this.nodejsApi + '/' + this.route + '/update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  deleteSmsSetting(id, header) {

 
    return this.httpClient.delete(this.nodejsApi + '/' + this.route + '/delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getSendActivationSmsByNetGSM(api, userCode, password, gsmNo, message, msgHeader) {
    // tslint:disable-next-line:max-line-length

    let requestURL = api + 'usercode=' + userCode + '&password=' + password + '&gsmno=' + gsmNo + '&message=' + message + '&msgheader=' + msgHeader + '&dil=TR';

 
    return this.httpClient.get(requestURL);
  }


 

}
