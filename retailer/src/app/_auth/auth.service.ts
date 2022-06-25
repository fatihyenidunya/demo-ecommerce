import { Injectable } from '@angular/core';
import { AppConnections } from '../app.connections';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }



  signup(data: FormData) {


    return this.httpClient.post(this.nodejsApi + '/individual-auth/signup', data);
  }

  login(data: FormData) {

    return this.httpClient.post(this.nodejsApi + '/individual-auth/login/', data);
  }

  // userAuthentication(userName, password) {
  //   const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
  //   const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
  //   return this.httpClient.post(this.nodejsApi + '/token', data, { headers: reqHeader });
  // }

  activateAccount(data: FormData) {

    return this.httpClient.post(this.nodejsApi + '/individual-auth/activate/', data);
  }


  uploadDocumentImage(registerId, data: FormData) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.put(this.nodejsApi + '/individual-auth/uploadDocumentImage/' + registerId, data);
  }



}
