import { Injectable } from '@angular/core';
import { AppConnections } from '../app.connections';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AgreementService {


  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }



  getAgreement(orderId) {
 
    return this.httpClient.get(this.nodejsApi + '/order-retail/getagreement/' + orderId);
  }





}
