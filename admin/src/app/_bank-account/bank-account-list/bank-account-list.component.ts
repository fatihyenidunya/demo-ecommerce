import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { BankAccountService } from '../bank-account.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-volume-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss']
})
export class BankAccountListComponent implements OnInit {

  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  public apiUrl = '';
  accounts;
  header;


  constructor(private modalService: NgbModal, private ngxIndexedDBService: NgxIndexedDBService, private bankAccountService: BankAccountService) {

    this.gets();
  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
    });
  }

  gets(): void {

    this.bankAccountService.gets(this.header).subscribe((res: any) => {
      this.accounts = res.accounts;
      console.log(this.accounts);
    }, err => {
      this.showError(err.error);
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
