
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';


@Injectable()
export class RoleService {

  nodejsApi;



  constructor(private http: HttpClient, private appConnections: AppConnections) {


    this.nodejsApi = appConnections.nodejsApi;
  }



  getRoles(header) {
    return this.http.get(this.nodejsApi + '/role/list', { headers: { 'Authorization': 'Bearer ' + header } });
  }


  getRole(id, header) {
    return this.http.get(this.nodejsApi + '/role/list/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  roleDelete(id, header) {
    return this.http.delete(this.nodejsApi + '/role/delete/' + id, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  saved(data: FormData, header) {
    return this.http.post(this.nodejsApi + '/role/' + 'new', data, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  updated(id, data: FormData, header) {
    return this.http.put(this.nodejsApi + '/role/' + 'update/' + id, data, { headers: { 'Authorization': 'Bearer ' + header } });
  }


}
