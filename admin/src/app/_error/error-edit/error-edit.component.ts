import { Component, OnInit } from '@angular/core';
import { AppConnections } from '../../app.connections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';


import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ErrorService } from '../error.service';


interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-error-edit',
  templateUrl: './error-edit.component.html',
  styleUrls: ['./error-edit.component.scss']
})
export class ErrorEditComponent implements OnInit {
  nodejsApi;
  errorId;

  counter;
  error;
  fixedBtnDisabled = false;



  public header;
  alerts: Alert[] = [{
    type: '',
    message: '',
  }];


  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService,
    private errorService: ErrorService,
    private simpleTimer: SimpleTimer,

  ) {

    this.nodejsApi = appConnections.nodejsApi;






    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.prepare(this.header);


    });



  }

  ngOnInit() {


  }


  prepare(header) {

    this.counter = 3;
    this.errorId = this.route.snapshot.params['id'];

    this.errorService.get(this.errorId, header).subscribe((res: any) => {
      this.error = res.error;
      if (this.error.fixed === false) {
        this.fixedBtnDisabled = false;
      } else {
        this.fixedBtnDisabled = true;
      }

    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });


  }




  OnSubmit(form: NgForm) {


    const formData = new FormData();

    formData.append('fixed', 'true');



    this.errorService.update(this.errorId, formData, this.header)
      .subscribe((res: any) => {
        this.error = res.error;
        this.fixedBtnDisabled = true;

      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

  }



  delete(): void {

    this.errorService.delete(this.errorId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../../', 'error']);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }


  public confirmToDelete(_function) {

    this.confirmationService.confirm(_function, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.delete();

        } else {

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }


  private closeInfo() {

    this.alerts.splice(this.alerts.indexOf({
      type: 'info',
      message: 'The data has been updated',
    }), 1);

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
      this.router.navigate(['../../../', 'error']);

    }
  }


}
