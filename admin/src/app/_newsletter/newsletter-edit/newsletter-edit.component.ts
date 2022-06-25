import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsletterService } from '../newsletter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Newsletter } from '../model/newsletter';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-newsletter-edit',
  templateUrl: './newsletter-edit.component.html',
  styleUrls: ['./newsletter-edit.component.scss']
})
export class NewsletterEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public newsletter = new Newsletter();
  counter: number;
  newsletterId;

  fileToUpload: File = null;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];
  header;

  endDate;
  startDate;

  startMonth = '1';
  startDay = '1';
  startYear = '2000';

  endMonth = '12';
  endDay = '30';
  endYear = '2030';

  types;
  selectedType;



  constructor(private newsletterService: NewsletterService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.newsletterService.moduleName;
    this.nodejsApi = appConnections.nodejsApi;



  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      this.types = JSON.parse('[{"type":"' + this.appConnections.Percantage + '"},{"type":"' + this.appConnections.Amount + '"},{"type": "' + this.appConnections.FreeCargo + '"}]');


      this.prepare(this.header);

    });
  }

  selectType(tip) {

    this.newsletter.type = tip;

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

    this.newsletterService.deleted(this.newsletterId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../', this.thisModule]);
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
    this.newsletterId = this.route.snapshot.params['id'];
    if (this.newsletterId !== '0') {
      this.newsletterService.getd(this.newsletterId, header).subscribe((res: any) => {
        this.newsletter = res.newsletter;
        this.selectedType = res.newsletter.type;
         this.startDate = JSON.parse("{"+'"year"' +":" + res.newsletter.startDate.substring(0, 4) +"," +'"month"'+':' + Number(res.newsletter.startDate.substring(5, 7)) +"," +'"day"'+':' + res.newsletter.startDate.substring(8, 10) + "}");
         this.endDate = JSON.parse("{"+'"year"' +":" + res.newsletter.endDate.substring(0, 4) +"," +'"month"'+':' + Number(res.newsletter.endDate.substring(5, 7)) +"," +'"day"'+':' + res.newsletter.endDate.substring(8, 10) + "}");



         this.startMonth = String(Number(res.newsletter.startDate.substring(5, 7)));
         this.startDay = String(Number(res.newsletter.startDate.substring(8, 10)));
         this.startYear = String(Number(res.newsletter.startDate.substring(0, 4)));

         
         this.endMonth = String(Number(res.newsletter.endDate.substring(5, 7)));
         this.endDay = String(Number(res.newsletter.endDate.substring(8, 10)));
         this.endYear = String(Number(res.newsletter.endDate.substring(0, 4)));

      
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


  selectStartDate(date): void {


    alert(JSON.stringify(date))


    this.startMonth = this.startDate.month;
    this.startDay = this.startDate.day;
    this.startYear = this.startDate.year;

  }

  selectEndDate(date): void {



    this.endMonth = this.endDate.month;
    this.endDay = this.endDate.day;
    this.endYear = this.endDate.year;


  }


  OnSubmit(form: NgForm) {


    const formData = new FormData();
    formData.append('imageUrl', this.newsletter.imageUrl);
    formData.append('title', this.newsletter.title);
    formData.append('description', this.newsletter.description);
    formData.append('startMonth', String(this.startMonth));
    formData.append('startDay', String(this.startDay));
    formData.append('startYear', String(this.startYear));

    formData.append('endMonth', String(this.endMonth));
    formData.append('endDay', String(this.endDay));
    formData.append('endYear', String(this.endYear));

    formData.append('type', String(this.newsletter.type));
    formData.append('amount', String(this.newsletter.amount));
    formData.append('limit', String(this.newsletter.limit));
    formData.append('subLimit', String(this.newsletter.subLimit));
    formData.append('code', String(this.newsletter.code));

    formData.append('link', String(this.newsletter.link));
    if (this.fileToUpload !== null) {
      formData.append('image', this.fileToUpload);
    } else {
      formData.append('image', this.newsletter.imageUrl);
    }

    if (this.newsletterId !== '0') {
      this.newsletterService.updated(this.newsletterId, formData, this.header)
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
      this.newsletterService.saved(formData, this.header)
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
    this.newsletter.imageUrl = '';
    this.newsletter.title = '';
    this.newsletter.description = '';
    this.newsletter.link = '';


  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.newsletter.imageUrl + ' - ' + this.newsletter.title, 'Do you really want to delete it ?')
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
