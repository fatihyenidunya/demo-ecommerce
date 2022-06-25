import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Message } from '../model/message';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.scss']
})
export class MessageEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public text = new Message();
  counter: number;
  messageId;

  fileToUpload: File = null;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private messageService: MessageService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.messageService.moduleName;
    this.nodejsApi = appConnections.nodejsApi;

    this.prepare();

  }

  ngOnInit() {
  }



  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.messageService.deleted(this.messageId).subscribe((res: any) => {
      this.router.navigate(['../../../', this.thisModule]);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  prepare() {
    this.alertReset();
    this.counter = 3;
    this.messageId = this.route.snapshot.params['id'];
    if (this.messageId !== '0') {
      this.messageService.getd(this.messageId).subscribe((res: any) => {
        this.text = res.message;

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


    const formData = new FormData();
    formData.append('name', this.text.name);
    formData.append('mail', this.text.mail);
    formData.append('phone', this.text.phone);
    formData.append('subject', this.text.subject);
    formData.append('message', this.text.message);
    formData.append('type', this.text.type.toString());
    formData.append('answered', this.text.answered.toString());
    formData.append('userName', this.text.userName);
    formData.append('answer', this.text.answer);
    formData.append('sendedBy', this.text.sendedBy);



    if (this.messageId !== '0') {
      this.messageService.updated(this.messageId, formData)
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
      this.messageService.saved(formData)
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
    this.text.name = '';
    this.text.mail = '';
    this.text.phone = '';
    this.text.subject = '';
    this.text.message = '';
    this.text.type = false;
    this.text.answered = false;
    this.text.userName = '';
    this.text.answered = false;
    this.text.sendedBy = '';



  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  // public confirmToDelete() {

  //   this.confirmationService.confirm(this.blog.imageUrl + ' - ' + this.blog.title, 'Do you really want to delete it ?')
  //     .then((confirmed) => {
  //       if (confirmed === true) {
  //         this.delete();
  //       }
  //     })
  //     .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  // }

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
        this.router.navigate(['../../../admin/', this.thisModule]);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }




}
