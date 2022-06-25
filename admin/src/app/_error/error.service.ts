import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {


  public moduleName = 'error';
  public serverError = '';
  public newProductBoxNumber;
  public status;
  nodejsApi;
  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }



  getQueryResult(page, pagesize, controller, fixed, code, startmonth, startday, startyear, endmonth, endday, endyear, header) {




    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/list?page=' + page + '&pagesize=' + pagesize + '&controller=' + controller + '&fixed=' + fixed + '&code=' + code + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear, { headers: { 'Authorization': 'Bearer ' + header } });
  }




  get(id, header) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  delete(id, header) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  update(id, data, header) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }



}
