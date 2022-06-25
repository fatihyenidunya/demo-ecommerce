import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Blog } from '../model/blog';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss']
})
export class BlogEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public blog = new Blog();
  counter: number;
  blogId;
  header;
  fileToUpload: File = null;

  imageUrl;
  imageApi;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private blogService: BlogService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.blogService.moduleName;
    this.nodejsApi = appConnections.nodejsApi;
    this.imageApi = appConnections.imageApi;


  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      this.prepare(this.header);
    });
  }

  handleFileInput(files) {
    console.log(files.target.files[0]);

    this.fileToUpload = files.target.files[0];


    this.imageUrl = this.fileToUpload;
  }

  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.blogService.deleted(this.blogId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../', this.thisModule]);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  prepare(header) {
    this.alertReset();
    this.counter = 3;
    this.blogId = this.route.snapshot.params['id'];
    if (this.blogId !== '0') {
      this.blogService.getd(this.blogId, header).subscribe((res: any) => {
        this.blog = res.blog;

        this.imageUrl = res.blog.imageUrl;

      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

    } else {
      this.disable = false;
      this.cleanData();
    }
  }


  OnSubmit(form: NgForm) {

    this.blog.writer = localStorage.getItem('userName');

    const formData = new FormData();
    formData.append('imageUrl', this.blog.imageUrl);
    formData.append('title', this.blog.title);
    formData.append('metaDescription', this.blog.metaDescription);
    formData.append('summary', this.blog.summary);
    formData.append('mainPage', this.blog.mainPage.toString());
    formData.append('publish', this.blog.publish.toString());
    formData.append('description', this.blog.description);
    formData.append('order', this.blog.order.toString());
    formData.append('writer', this.blog.writer);
    // if (this.fileToUpload !== null) {
    //   formData.append('image', this.fileToUpload);
    // } else {
    //   formData.append('image', this.blog.imageUrl);
    // }

    formData.append('image', this.imageUrl);

    if (this.blogId !== '0') {
      this.blogService.updated(this.blogId, formData, this.header)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    } else {
      this.blogService.saved(formData, this.header)
        .subscribe((res: any) => {
          this.showInfo();

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    }
  }


  cleanData() {
    this.blog.imageUrl = '';
    this.blog.title = '';
    this.blog.summary = '';
    this.blog.mainPage = false;
    this.blog.publish = false;
    this.blog.description = '';
    this.blog.metaDescription = '';
    this.blog.order = 0;


  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.blog.title, 'Do you really want to delete it ?')
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
