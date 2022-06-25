import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { CommentService } from '../comment.service';
import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  public comments: any;
  public total = 0;
  public currentPage = 1;
  public pageNumber = 1;
  public pageSize = 50;

  totalComments = 0;
  nodejsApi;

  endDate;
  startDate;
  startMonth = '1';
  startDay = '1';
  startYear = '2000';

  endMonth = '12';
  endDay = '30';
  endYear = '2030';
  header;
  public selectedStatus = 'Hepsi';
  public statuses = JSON.parse('[{"status":"Hepsi"},{"status":"Yayınlandi"},{"status":"Yayinlanmadi"}]');


  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private commentService: CommentService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;


  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.getQueryResults(this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);


    });


  }

  // gets(): void {

  //   this.commentService.getComments().subscribe((res: any) => {
  //     this.comments = res.comments;
  //     console.log(this.comments);
  //   }, err => {
  //     this.showError(err.error);
  //   });
  // }




  changePage(show) {

    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectStartDate(date): void {

    this.pageNumber = 1;
    this.startMonth = this.startDate.month;
    this.startDay = this.startDate.day;
    this.startYear = this.startDate.year;
    // this.orderQuery.startDate = new Date(this.startDate.year + '/' + this.startDate.month + '/' + this.startDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectEndDate(date): void {

    this.pageNumber = 1;

    this.endMonth = this.endDate.month;
    this.endDay = this.endDate.day;
    this.endYear = this.endDate.year;

    // this.orderQuery.endDate = new Date(this.endDate.year + '/' + this.endDate.month + '/' + this.endDate.day);
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  selectStatus(status) {

    this.selectedStatus = status;
    this.pageNumber = 1;
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  getQueryResults(page, status, startmonth, startday, startyear, endmonth, endday, endyear): void {



    // tslint:disable-next-line:max-line-length
    this.commentService.getQueryResult(page, this.pageSize, status, startmonth, startday, startyear, endmonth, endday, endyear, this.header)
      .subscribe((res: any) => {

        this.comments = res.comments;
        this.totalComments = res.totalComment;

       console.log(this.comments);



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
    // tslint:disable-next-line:max-line-length
    this.getQueryResults(this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

  }

  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
