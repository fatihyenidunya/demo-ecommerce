import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';


@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss']
})
export class ErrorListComponent implements OnInit {

  totalItems = 20;


  errors;


  public pageNumber = 1;
  public pageSize = 20;
  endDate;
  startDate;

  startMonth = '1';
  startDay = '1';
  startYear = '2000';

  endMonth = '12';
  endDay = '30';
  endYear = '2030';

  public selectedFixed = 'All';
  public selectedCode = 'All';

  textforsearch;
 
  errorCodes;
  header;
  fixes = JSON.parse('[{"fixed":"All"},{"fixed":"true"},{"fixed":"false"}]');

  constructor(private errorService: ErrorService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private appConnections: AppConnections,
    private ngxIndexedDBService:NgxIndexedDBService

  ) {

 
    this.errorCodes = this.appConnections.errorCodes;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);


  }

  onChange(text) {


    if (text.length > 2) {
      this.textforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    if (text.length === 0) {

      this.textforsearch = text;
      this.pageNumber = 1;
      // tslint:disable-next-line:max-line-length
      this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

  }

  selectStartDate(date): void {

    this.pageNumber = 1;
    this.startMonth = this.startDate.month;
    this.startDay = this.startDate.day;
    this.startYear = this.startDate.year;
    // this.orderQuery.startDate = new Date(this.startDate.year + '/' + this.startDate.month + '/' + this.startDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectEndDate(date): void {

    this.pageNumber = 1;

    this.endMonth = this.endDate.month;
    this.endDay = this.endDate.day;
    this.endYear = this.endDate.year;

    // this.orderQuery.endDate = new Date(this.endDate.year + '/' + this.endDate.month + '/' + this.endDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  ngOnInit() {


  
  }

  selectFixed(fixed) {

    this.selectedFixed = fixed;
    this.pageNumber = 1;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectCode(code) {

    this.selectedCode = code;
    this.pageNumber = 1;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  getQueryResults(page, controller, fixed, code, startmonth, startday, startyear, endmonth, endday, endyear): void {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

          // tslint:disable-next-line:max-line-length
    this.errorService.getQueryResult(page, this.pageSize, controller, fixed, code, startmonth, startday, startyear, endmonth, endday, endyear,this.header)
    .subscribe((res: any) => {

    

      this.errors = res.errors;
      this.totalItems = res.totalItems;

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(err);
      }

    });
    
    });



  }

  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.textforsearch, this.selectedFixed, this.selectedCode, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
