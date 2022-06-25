import { Injectable } from '@angular/core';
declare var $: any;
@Injectable()
export class SignalrService {
    private connection: any;
    private proxy: any;
constructor() {}
public initializeSignalRConnection(): void {
  let signalRServerEndPoint = 'https://notification.api.testserver.com';
        this.connection = $.hubConnection(signalRServerEndPoint);
        this.proxy = this.connection.createHubProxy('ServerHub');
  
  this.proxy.on('messageReceived', (serverMessage) => this.onMessageReceived(serverMessage));
this.connection.start().done((data: any) => {
            console.log('Connected to Notification Hub');
            this.broadcastMessage();
        }).catch((error: any) => {
            console.log('Notification Hub error -> ' + error);
        });
    }
private broadcastMessage(): void {  
        this.proxy.invoke('NotificationService', 'text message')
           .catch((error: any) => {
               console.log('broadcastMessage error -> ' + error); 
            });
        }

 private onMessageReceived(serverMessage: string) {
        console.log('New message received from Server: ' + serverMessage);
 }
}