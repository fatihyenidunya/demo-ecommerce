import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public baseUrl;
  public moduleName = 'message';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });





  // nodejs start after that line

  saved(data: FormData) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data);
  }


  getsd(page, pageSize) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list?page=' + page + '&pagesize=' + pageSize);
  }

  getd(id) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + id);
  }

  updated(id, data: FormData) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + id, data);
  }

  deleted(id) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'delete/' + id);
  }

}
