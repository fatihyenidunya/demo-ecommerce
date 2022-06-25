import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  public baseUrl;
  public moduleName = 'bankaccount';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });

    // nodejs start after that line

    save(data, header) {

      return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data, { headers: { 'Authorization': 'Bearer ' + header } });
    }


    gets(header) {
      return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list', { headers: { 'Authorization': 'Bearer ' + header } });
    }

    get(id, header) {

      return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
    }

    update(id, data, header) {
      return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
    }

    delete(id, header) {
      return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
    }



}
