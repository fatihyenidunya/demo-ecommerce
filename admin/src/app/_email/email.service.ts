import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  public baseUrl;
  public moduleName = 'email';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.baseUrl = appConnections.api;
    this.nodejsApi = appConnections.nodejsApi;
  }



  save(data: FormData, header) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  gets(header) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  get(id, header) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  update(id, data: FormData, header) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  delete(id, header) {
    return this.httpClient.delete(this.nodejsApi + '/' + this.moduleName + '/' + 'delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

}
