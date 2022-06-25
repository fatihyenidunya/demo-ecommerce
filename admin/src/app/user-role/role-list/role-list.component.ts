import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';

import { NgxIndexedDBService } from 'ngx-indexed-db';
import { RoleService } from '../role.service';


@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  public roles: any;
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;

  header;

  constructor(private modalService: NgbModal, private roleService: RoleService, private ngxIndexedDBService: NgxIndexedDBService) {



  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });
  }

  gets(header): void {

    this.roleService.getRoles(header).subscribe((res: any) => {
      this.roles = res.roles;
      console.log(this.roles);
    }, err => {
      this.showError(err.error);
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
