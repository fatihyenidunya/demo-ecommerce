import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ChatService } from '../chat.service';
import { IMessage } from '../model/message';
import { AppConnections } from '../../app.connections';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  public chats: any;
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  nodejsApi;

  constructor(private modalService: NgbModal, private chatService: ChatService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.gets();

  }

  ngOnInit() {
  }

  gets(): void {

    this.chatService.getsd().subscribe((res: any) => {
      this.chats = res.chats;
      console.log(this.chats);
    }, err => {
      this.showError(JSON.stringify(err));
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
