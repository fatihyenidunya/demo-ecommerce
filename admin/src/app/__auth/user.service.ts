
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';
import { User } from './user.model';

@Injectable()
export class UserService {
  readonly rootUrl = '';

  nodejsApi;

  public moduleName = 'user-signup';

  constructor(private http: HttpClient, private appConnections: AppConnections) {

    this.rootUrl = appConnections.api;
    this.nodejsApi = appConnections.nodejsApi;
  }

  registerUser(user: User, roles: string[]) {
    const body = {
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email,
      Customer: user.Customer,
      Officer: user.Officer,
      Country: user.Country,
      Address: user.Address,
      Phone: user.Phone,
      Roles: roles
    };
    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/api/account/post', body, { headers: reqHeader });
  }

  userAuthentication(userName, password) {
    const data = 'username=' + userName + '&password=' + password + '&grant_type=password';
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
  }

  getUserClaims() {
    return this.http.get(this.rootUrl + '/api/account/GetUserClaims', { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') }) });
  }

  getAllRoles() {
    const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.get(this.rootUrl + '/api/role/GetAllRoles', { headers: reqHeader });
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;


    const userRoles = this.appConnections.userRoles;


    allowedRoles.forEach(element => {
      if (userRoles.find(e => e.role === element)) {
        const x = userRoles.find(e => e.role === element).role;

        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }



  checkDatabaseForNewOrder() {
    return this.http.get(this.rootUrl + 'api/mainpage/checkdatabaseforneworder');
  }

  updateNewOrderNotify(userId) {
    return this.http.get(this.rootUrl + 'api/mainpage/updatenewordernotify/' + userId);
  }


  checknewordernotify(orderId, userId) {
    return this.http.get(this.rootUrl + 'api/mainpage/checknewordernotify/' + orderId + '/' + userId);
  }



  // nodejs start after that line

  getUsers(header) {
    return this.http.get(this.nodejsApi + '/user/list', { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getUsersByRole(role, userName, header) {
    return this.http.get(this.nodejsApi + '/user/userlist/' + role + '/' + userName, { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getUser(id, header) {
    return this.http.get(this.nodejsApi + '/user/list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  userDelete(id, header) {
    return this.http.delete(this.nodejsApi + '/user/delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  saved(data: FormData, header) {
    return this.http.post(this.nodejsApi + '/user/' + 'new', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }



  userAuthenticationd(data: FormData) {


    return this.http.post(this.nodejsApi + '/user/login/', data);
  }

}
