import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../video.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Video } from '../model/video';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
  styleUrls: ['./video-edit.component.scss']
})
export class VideoEditComponent implements OnInit {



  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public video = new Video();
  counter: number;
  videoId;
  videoWidth;
  videoHeight;
  sanitizer;
  fileToUpload: File = null;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  header;
  constructor(private videoService: VideoService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService,
    public domSanitizer: DomSanitizer

  ) {



    this.thisModule = this.videoService.moduleName;
    this.sanitizer = domSanitizer;
    this.nodejsApi = appConnections.nodejsApi;



  }

  ngOnInit() {

    this.videoWidth = (window.innerWidth) / 1.7;
    this.videoHeight = (window.innerWidth) / 3;

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.prepare(this.header);

    });


  }

  videoUrl(video) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  onResize(event) {


    this.videoWidth = (event.target.innerWidth) / 1.7;
    this.videoHeight = (event.target.innerWidth) / 3;
  }

  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }


  getTrustedUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  delete(): void {

    this.videoService.deleted(this.videoId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../', this.thisModule]);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(err);
      }
    });

  }

  prepare(header) {
    this.alertReset();
    this.counter = 3;
    this.videoId = this.route.snapshot.params['id'];
    if (this.videoId !== '0') {
      this.videoService.getd(this.videoId, header).subscribe((res: any) => {
        this.video = res.video;
        this.video.videoUrl = this.getTrustedUrl(this.video.videoUrl);


      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(err);
        }
      });

    } else {
      this.disable = false;
      this.cleanData();
    }
  }


  OnSubmit(form: NgForm) {


    const formData = new FormData();
    formData.append('videoUrl', this.video.videoUrl);
    formData.append('title', this.video.title);
    formData.append('mainPage', this.video.mainPage.toString());
    formData.append('publish', this.video.publish.toString());
    formData.append('order', this.video.order.toString());


    if (this.videoId !== '0') {
      this.videoService.updated(this.videoId, formData, this.header)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(err);
          }
        });
    } else {
      this.videoService.saved(formData, this.header)
        .subscribe((res: any) => {
          this.showInfo();

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(err);
          }
        });
    }
  }


  cleanData() {
    this.video.videoUrl = '';
    this.video.title = '';
    this.video.mainPage = false;
    this.video.publish = false;
    this.video.order = 0;


  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.videoUrl(this.video.videoUrl) + ' - ' + this.video.title, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.delete();
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  public showInfo() {
    if (this.isEdit === true) {
      this.alerts.push({
        type: 'info',
        message: 'The data has been updated',
      });
    } else {
      this.alerts.push({
        type: 'success',
        message: 'The data was saved succesfully',
      });
    }
    this.simpleTimer.newTimer('3sec', 1, false);
    this.simpleTimer.subscribe('3sec', () => this.callback());
  }


  private closeInfo() {
    if (this.isEdit === true) {
      this.alerts.splice(this.alerts.indexOf({
        type: 'info',
        message: 'The data has been updated',
      }), 1);
    } else {
      this.alerts.splice(this.alerts.indexOf({
        type: 'success',
        message: 'The data was saved succesfully',
      }), 1);
    }
  }

  alertClose(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  alertReset() {
    this.alerts = Array.from(ALERTS);
    this.counter = 0;
  }

  callback() {
    this.counter--;
    if (this.counter === 0) {
      this.simpleTimer.delTimer('3sec');
      if (this.isEdit === true) {
        this.router.navigate(['../../../', this.thisModule]);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }




}
