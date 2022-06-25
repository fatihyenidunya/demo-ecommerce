import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationEmailService } from '../notificationemail.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { NotificationEmail } from '../model/notificationEmail';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-notificationemail-edit',
  templateUrl: './notificationemail-edit.component.html',
  styleUrls: ['./notificationemail-edit.component.scss']
})
export class NotificationEmailEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public notificationEmail = new NotificationEmail();
  counter: number;
  emailId;

  fileToUpload: File = null;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  header;
  imageApi;
  constructor(private notificationEmailService: NotificationEmailService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.notificationEmailService.moduleName;
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
  }

  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.notificationEmailService.deleted(this.emailId, this.header).subscribe((res: any) => {
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
    this.emailId = this.route.snapshot.params['id'];
    if (this.emailId !== '0') {
      this.notificationEmailService.getd(this.emailId, header).subscribe((res: any) => {
        this.notificationEmail = res.email;

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
    formData.append('whose', this.notificationEmail.whose);
    formData.append('email', this.notificationEmail.email);


    if (this.emailId === '603bcb4c664ed743f4a8ae12') {
      formData.append('whatFor', 'NewOrder');
    } else if (this.emailId === '6049497d1b26f21318b4192f') {
      formData.append('whatFor', 'rapor');
    } else if (this.emailId === '604a89da43435e49089bdd9a') {
      formData.append('whatFor', 'NewBarber');
    } else {
      formData.append('whatFor', this.notificationEmail.whatFor);
    }




    if (this.emailId !== '0') {
      this.notificationEmailService.updated(this.emailId, formData, this.header)
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
      this.notificationEmailService.saved(formData, this.header)
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
    this.notificationEmail.whose = '';
    this.notificationEmail.email = '';
    this.notificationEmail.whatFor = '';
  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.notificationEmail.email, 'Do you really want to delete it ?')
      .then((confirmed) => {
        if (confirmed === true) {


          if (this.emailId === '603bcb4c664ed743f4a8ae12') {

          } else if (this.emailId === '6049497d1b26f21318b4192f') {

          } else if (this.emailId === '604a89da43435e49089bdd9a') {

          } else {

            this.delete();
          }

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
