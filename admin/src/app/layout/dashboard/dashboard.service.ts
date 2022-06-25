import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConnections } from '../../app.connections';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public baseUrl;
  public moduleName = 'dashboard';
  public serverError = '';
  public defaultCountryNameLower = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {


    this.defaultCountryNameLower = this.appConnections.countryNameLower;
    this.nodejsApi = appConnections.nodejsApi;

  }


  countsd(status, header) {
    return this.httpClient.get(this.nodejsApi + '/order/dashboard/' + status, { headers: { 'Authorization': 'Bearer ' + header } });
  }

  getProductStock(header) {
    return this.httpClient.get(this.nodejsApi + '/dashboard/getproductstock', { headers: { 'Authorization': 'Bearer ' + header } });
  }

}
