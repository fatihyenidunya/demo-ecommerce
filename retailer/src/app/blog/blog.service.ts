import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHeaderResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConnections } from '../app.connections';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  public moduleName = 'blog-retail';
  public serverError = '';
  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
  }

  header = new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('userToken') });


  getBlogs(pageNumber, pageSize) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/list/' + pageNumber + '/' + pageSize);
  }

  getBlog(id) {
    return this.httpClient.get(this.nodejsApi + '/' + this.moduleName + '/list/' + id);
  }

}
