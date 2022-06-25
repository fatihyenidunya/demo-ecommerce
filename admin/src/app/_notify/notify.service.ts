import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConnections } from '../app.connections';


@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    public moduleName = 'notify';
    nodejsApi;

    constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

        this.nodejsApi = appConnections.nodejsApi;
    }

    header = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('userToken') });



    getNotifies(userName, notifyfor, status) {

        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/notifies/' + userName + '/' + notifyfor + '/' + status);
    }

    getRetailerNotifies(userName, notifyfor, status) {

        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/retailernotifies/' + userName + '/' + notifyfor + '/' + status);
    }

    checkNotify(orderId, status, number) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/checknotify/' + orderId + '/' + status + '/' + number);
    }

    checkOrderOperationNotify(orderId, status, number) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/checkOrderOperationNotify/' + orderId + '/' + status + '/' + number);
    }

    getOrderNotifies(notifyfor, owner, role) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/ordernotifies/' + notifyfor + '/' + owner + '/' + role);
    }

    getOrderRetailerNotifies(notifyfor, owner, role) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/orderretailernotifies/' + notifyfor + '/' + owner + '/' + role);
    }

    getWarehouseNotifies(notifyfor, status) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/warehousenotifies/' + notifyfor + '/' + status);
    }

    getQueryResult(notifyFor, page, pagesize, status, startmonth, startday, startyear, endmonth, endday, endyear, checked) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/notifylist/' + notifyFor + '?page=' + page + '&pagesize=' + pagesize + '&status=' + status + '&startmonth=' + startmonth + '&startday=' + startday + '&startyear=' + startyear + '&endmonth=' + endmonth + '&endday=' + endday + '&endyear=' + endyear + '&checked=' + endyear);
    }



}
