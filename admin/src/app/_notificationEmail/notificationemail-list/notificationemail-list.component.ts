import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { NotificationEmailService } from '../notificationemail.service';

import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-notificationemail-list',
  templateUrl: './notificationemail-list.component.html',
  styleUrls: ['./notificationemail-list.component.scss']
})
export class NotificationEmailListComponent implements OnInit {
  public emails: [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  nodejsApi;
  imageApi;
  header;
  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private notificationEmailService: NotificationEmailService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.imageApi = appConnections.imageApi;

  }

  ngOnInit() {



    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      this.gets(this.header);
    });


  }

  gets(header): void {

    this.notificationEmailService.getsd(header).subscribe((res: any) => {
      this.emails = res.emails;
      console.log(this.emails);
    }, err => {


      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(err);
      }
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
