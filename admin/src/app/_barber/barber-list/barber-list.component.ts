import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { BarberService } from '../barber.service';
import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barber-list',
  templateUrl: './barber-list.component.html',
  styleUrls: ['./barber-list.component.scss']
})
export class BarberListComponent implements OnInit {
  public barbers: any = [];



  pageSize = 50;
  totalItem;
  pageNumber = 1;
  textForSearch = '';

  nodeJsApi;


  header;
  companies;

  selectedCompany;




  constructor(private modalService: NgbModal, private appConnections: AppConnections, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private barberService: BarberService) {

    this.nodeJsApi = this.appConnections.nodejsApi;


  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.pageNumber, this.pageSize, this.textForSearch, this.header);

    });

  }


  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    this.gets(this.pageNumber, this.pageSize, this.textForSearch, this.header);

  }

  onChange(textForSearch) {

    if (textForSearch.length > 2) {
      this.gets(this.pageNumber, this.pageSize, this.textForSearch, this.header);

    }

    if (textForSearch.length === 0) {
      this.gets(this.pageNumber, this.pageSize, this.textForSearch, this.header);

    }
  }



  gets(pagenumber, pagesize, text, header): void {

    this.barberService.getsd(pagenumber, pagesize, text, header).subscribe((res: any) => {
      this.barbers = res.barbers;
      this.totalItem = res.totalItem;
      console.log(this.barbers);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
