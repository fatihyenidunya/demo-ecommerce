import { Injectable } from '@angular/core';
import { Response, Request, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from './model/setting';
import { AppConnections } from '../app.connections';
import { setCurrentInjector } from '@angular/core/src/di/injector';

@Injectable({
  providedIn: 'root'
})
export class SettingService {


  public serverError = '';
  nodejsApi;
  moduleName = 'setting';

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });

  options = new HttpHeaders({
    'Accept': 'application/json',
    'content-type': 'application/json',
    'x-api-version': 'bubovage',
    'x-ibm-client-secret': 'vW7lI7cT7mP0yO2tQ3sA3nE6wY1mG3lL8vM2oJ1cA3xM1hV6lP',
    'x-ibm-client-id': '4845590b-515b-40d8-a2b8-838bb41dc1a7'
  });



  postLoginToMNG(tokenUrl, userName, password, apiVersion, clientSecret, clientId) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(tokenUrl,
      { username: userName, password: password, identityType: 1 },
      {
        headers:
          new HttpHeaders({
            'Accept': 'application/json',
            'content-type': 'application/json',
            'x-api-version': apiVersion,
            'x-ibm-client-secret': clientSecret,
            'x-ibm-client-id': clientId
          })
      });
  }


  postRefreshMNGToken(refreshTokenUrl, refreshToken, apiVersion, clientSecret, clientId) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post(refreshTokenUrl + refreshToken, {},
      {
        headers:
          new HttpHeaders({
            'Accept': 'application/json',
            'content-type': 'application/json',
            'x-api-version': apiVersion,
            'x-ibm-client-secret': clientSecret,
            'x-ibm-client-id': clientId
          })
      });
  }



  getOrderByReferenceId(endPoint, referenceId, bearerToken, apiVersion, clientSecret, clientId) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(endPoint + referenceId,
      {
        headers:
          new HttpHeaders({
            'Accept': 'application/json',
            'content-type': 'application/json',
            'x-api-version': apiVersion,
            'x-ibm-client-secret': clientSecret,
            'x-ibm-client-id': clientId,
            'Authorization': 'Bearer ' + bearerToken
          })
      });
  }


  save(data: FormData) {

    return this.httpClient.post(this.nodejsApi + '/' + this.moduleName + '/' + 'new', data);
  }


  get(company) {

    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/' + 'list/' + company);
  }

  update(company, data: FormData) {
    return this.httpClient.put(this.nodejsApi + '/' + this.moduleName + '/' + 'update/' + company, data);
  }



}
