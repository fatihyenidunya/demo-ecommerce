import { Injectable } from '@angular/core';
import { AppConnections } from './app.connections';
import { HttpClient } from '@angular/common/http';



@Injectable({
    providedIn: 'root'
})
export class AppService {


    nodejsApi;

    constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
        this.nodejsApi = appConnections.nodejsApi;
    }
    getGeneral(id) {

        return this.httpClient.get(this.nodejsApi + '/general/' + 'list/' + id);
    }

    getSearchResult(text) {

        return this.httpClient.get(this.nodejsApi + '/product/' + 'search/' + text);
    }

    getCategoriesForMenu() {
        return this.httpClient.get(this.nodejsApi + '/category/' + 'categoriesformenu');
    }


    postNewsletterMail(data: FormData) {

        return this.httpClient.post(this.nodejsApi + '/general/' + 'postnewslettermail', data);
    }


}
