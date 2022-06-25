import { Injectable } from '@angular/core';
import { AppConnections } from '../app.connections';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class MyaddressService {


  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }


  getProfile(customerId) {
    return this.httpClient.get(this.nodejsApi + '/profile/detail/' + customerId);
  }


  getContacts(customerId) {
    return this.httpClient.get(this.nodejsApi + '/profile/contacts/' + customerId);
  }

  getCustomerInfo(customerId) {
    return this.httpClient.get(this.nodejsApi + '/profile/customerinfo/' + customerId);
  }

  getContact(id) {
    return this.httpClient.get(this.nodejsApi + '/profile/contact/' + id);
  }

  postContact(data: FormData) {

    return this.httpClient.post(this.nodejsApi + '/profile/contact', data);
  }

  updateContact(id, data: FormData) {

    return this.httpClient.put(this.nodejsApi + '/profile/contact/' + id, data);
  }

  deleteContact(customerId, contactId) {

    return this.httpClient.delete(this.nodejsApi + '/profile/deletecontact/' + customerId + '/' + contactId);
  }




}
