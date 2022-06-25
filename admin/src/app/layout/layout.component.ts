import { Component, OnInit } from '@angular/core';
import { UserService } from '../__auth/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  collapedSideBar: boolean;
  userName;
  isLoginError = false;
  subscription: Subscription;
  constructor(private userService: UserService, private messageService: MessageService) {

    // this.userInfo();

    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        alert('message can be work ' + message.text);

      }
    });

  }

  ngOnInit() { }
  userInfo() {
    this.userService.getUserClaims().subscribe((data: any) => {


      this.userName = data.userName;


    },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
      });
  }
  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}
