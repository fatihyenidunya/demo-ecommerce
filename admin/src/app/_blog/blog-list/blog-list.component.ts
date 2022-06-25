import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { BlogService } from '../blog.service';
import { IBlog } from '../model/blog';
import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  public blogs: IBlog[] = [];

  nodejsApi;
  imageApi;
  header;

  public pageNumber = 1;
  public pageSize = 25;
  textforsearch = '';
  totalItems = 0;

  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private blogService: BlogService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.imageApi = appConnections.imageApi;

  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);

    });
  }
  nowPage(wantedPage): void {

    this.pageNumber = wantedPage;
    // tslint:disable-next-line:max-line-length
    this.gets(this.pageNumber, this.pageSize, this.textforsearch);

  }



  onChange(text) {

    if (text.length > 2) {
      this.textforsearch = text;
      this.pageNumber = 1;
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);
    }

    if (text.length === 0) {
      this.gets(this.pageNumber, this.pageSize, this.textforsearch);
    }

  }

  gets(page, pageSize, title): void {

    this.blogService.getQueryResult(page, pageSize, title, this.header).subscribe((res: any) => {
      this.blogs = res.blogs;
      this.totalItems = res.totalItems;
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
