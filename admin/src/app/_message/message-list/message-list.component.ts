import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { MessageService } from '../message.service';
import { IMessage } from '../model/message';
import { AppConnections } from '../../app.connections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  public messages: IMessage[] = [];
  public total = 0;
  public pageNumber = 1;
  public pageSize = 20;
  totalItems = 0;
  nodejsApi;

  constructor(private modalService: NgbModal, private router: Router, private messageService: MessageService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.gets(this.pageNumber, this.pageSize);

  }

  ngOnInit() {
  }

  gets(page, pageSize): void {

    this.messageService.getsd(page, pageSize).subscribe((res: any) => {
      this.messages = res.messages;
      this.totalItems = res.totalItems;

    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });


  }


  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;

  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
