import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  public moduleName = 'newsletter';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }




  // nodejs start after that line

  saved(data: FormData, header) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

 

  getsd(header) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getd(id, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  sendNewsletterViaEmail(id, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'sendNewsletterViaEmail/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  updated(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  deleted(id, header) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

}
