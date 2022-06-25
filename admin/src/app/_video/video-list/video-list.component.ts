import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { VideoService } from '../video.service';
import { IVideo } from '../model/video';
import { AppConnections } from '../../app.connections';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  public videos: IVideo[] = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  nodejsApi;
  sanitizer;
  safeUrl;
  header;
  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, public domSanitizer: DomSanitizer, private videoService: VideoService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.sanitizer = domSanitizer;


  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });
  }

  getTrustedUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  gets(header): void {

    this.videoService.getsd(header).subscribe((res: any) => {
      this.videos = res.videos;
      this.videos.forEach(v => {
        v.videoUrl = this.getTrustedUrl(v.videoUrl);

      });


    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(err);
      }
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
