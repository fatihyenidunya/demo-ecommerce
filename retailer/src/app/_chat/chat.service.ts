import { Injectable } from '@angular/core';
import { AppConnections } from '../app.connections';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ChatService {


  nodejsApi;

  constructor(private httpClient: HttpClient, private appConnections: AppConnections) {
    this.nodejsApi = appConnections.nodejsApi;
  }

  getMessages(customerId) {
    return this.httpClient.get(this.nodejsApi + '/chat-retail/getmessages/' + customerId);
  }

  postMessage(data: FormData) {
    return this.httpClient.post(this.nodejsApi + '/chat-retail/postMessage/', data);
  }





}
