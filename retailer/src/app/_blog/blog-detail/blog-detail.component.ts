import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConnections } from '../../app.connections';
import { Blog } from '../model/blog';

import { NgForm } from '@angular/forms';
import { Title,Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  blog;
  blogId;
  customerId;
  nodejsApi;

  constructor(private blogService: BlogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private titleService:Title,
    private metaService:Meta


  ) {

    this.blogId = this.route.snapshot.params.id;

    this.blogId = this.blogId.split('&')[1];
    this.customerId = localStorage.getItem('userId');
    this.nodejsApi = appConnections.nodejsApi;
    this.getBlog(this.blogId);


  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }


  getBlog(blogId): void {
    this.blogService.getBlog(blogId).subscribe((res: any) => {
      this.blog = res.blog;
      this.titleService.setTitle(this.blog.title);

      this.metaService.updateTag({ name: 'description', content: this.blog.metaDescription });


      console.log(this.blog);

    }, err => {
    });
  }
}
