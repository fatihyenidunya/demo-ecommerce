import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { GeneralService } from '../general.service';
import { IGeneral } from '../model/general';
import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-list',
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.scss']
})
export class GeneralListComponent implements OnInit {
  public generals: IGeneral[] = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  nodejsApi;
  header;

  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private generalService: GeneralService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;


  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });
  }

  gets(header): void {

    this.generalService.getsd(header).subscribe((res: any) => {
      this.generals = res.generals;
      console.log(this.generals);
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
