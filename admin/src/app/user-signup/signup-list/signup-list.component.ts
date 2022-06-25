import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { UserService } from '../../__auth/user.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-signup-list',
  templateUrl: './signup-list.component.html',
  styleUrls: ['./signup-list.component.scss']
})
export class SignupListComponent implements OnInit {
  public users: any;
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;

  header;

  constructor(private modalService: NgbModal, private ngxIndexedDBService: NgxIndexedDBService, private userService: UserService) {



  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });
  }

  gets(header): void {

    this.userService.getUsers(header).subscribe((res: any) => {
      this.users = res.users;
      console.log(this.users);
    }, err => {
      this.showError(err.error);
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
