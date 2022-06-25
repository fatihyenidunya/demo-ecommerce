import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConnections } from '../../app.connections';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  grandTotal = 0;

  public totalBlog = 0;
  public pageNumber = 1;
  public pageSize = 5;
  nodejsApi;

  blogs;

  customerId;

  constructor(private modalService: NgbModal,
              private route: ActivatedRoute,
              private router: Router,
              private blogService: BlogService,
              private appConnections: AppConnections) {

    // this.customId = this.route.snapshot.params['id'];
    this.nodejsApi = appConnections.nodejsApi;
    this.customerId = localStorage.getItem('customerId');

  }

  ngOnInit() {
    this.getBlogs(this.pageNumber, this.pageSize);
    window.scrollTo(0, 0);
  }


  getBlogs(pageNumber, pageSize): void {
    this.blogService.getBlogs(pageNumber, pageSize).subscribe((res: any) => {
      this.blogs = res.blogs;

      this.totalBlog = this.blogs.length;

      console.log(this.totalBlog);
      console.log(this.blogs);

    }, err => {
    });
  }

  currentPage(wantedPage): void {

    this.pageNumber = wantedPage;

    this.getBlogs(this.pageNumber, this.pageSize);

  }

}
