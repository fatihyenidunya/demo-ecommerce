import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../comment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Comment } from '../model/comment';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public comment: any;
  counter: number;
  commentId;
  header;

  fileToUpload: File = null;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private commentService: CommentService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.commentService.moduleName;
    this.nodejsApi = appConnections.nodejsApi;



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
  }

  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.commentService.deleted(this.commentId, this.header).subscribe((res: any) => {
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
    this.commentId = this.route.snapshot.params.id;
    if (this.commentId !== '0') {
      this.commentService.getComment(this.commentId, this.header).subscribe((res: any) => {
        this.comment = res.comment;

      



      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

    } else {
      this.disable = false;

    }
  }


  OnSubmit(form: NgForm) {


    const formData = new FormData();

    formData.append('publish', this.comment.publish.toString());



    this.commentService.updated(this.commentId, formData, this.header)
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





  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.comment.comment, 'Do you really want to delete it ?')
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

      }
    }
  }




}
