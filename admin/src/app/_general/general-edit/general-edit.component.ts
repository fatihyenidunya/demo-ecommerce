import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../general.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { General } from '../model/general';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-general-edit',
  templateUrl: './general-edit.component.html',
  styleUrls: ['./general-edit.component.scss']
})
export class GeneralEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public general = new General();
  counter: number;
  generalId;

  fileToUpload: File = null;
  fileToUploadTwo: File = null;
  fileToUploadThree: File = null;
  data: any;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];
  header;

  constructor(private generalService: GeneralService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.generalService.moduleName;
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

    console.log(files.target);
  }

  handleFileInputTwo(files) {
    console.log(files.target.files[0]);

    this.fileToUploadTwo = files.target.files[0];
  }

  OnSubmitSecondImage(form: NgForm) {
    const formData = new FormData();
    formData.append('generalId', this.generalId);
    if (this.fileToUploadTwo !== null) {
      formData.append('image', this.fileToUploadTwo);
    }
    this.generalService.postSecondImage(formData, this.header)
      .subscribe((res: any) => {
        this.showInfo();

      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });
  }


  // handleFileInputThree(files) {
  //   console.log(files.target.files[0]);

  //   this.fileToUploadThree = files.target.files[0];
  // }

  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.generalService.deleted(this.generalId, this.header).subscribe((res: any) => {
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
    this.generalId = this.route.snapshot.params['id'];
    if (this.generalId !== '0') {
      this.generalService.getd(this.generalId, header).subscribe((res: any) => {
        this.general = res.general;

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
    formData.append('favicon', this.general.favicon);
    formData.append('title', this.general.title);
    formData.append('metaDescription', this.general.metaDescription);
    formData.append('phone', this.general.phone);
    formData.append('mail', this.general.mail);
    formData.append('registerBtn', this.general.registerBtn);
    formData.append('loginBtn', this.general.loginBtn);
    formData.append('imageUrl', this.general.imageUrl);
    formData.append('aboutUs', this.general.aboutUs);
    formData.append('contact', this.general.contact);
    formData.append('productsBtn', this.general.productsBtn);
    formData.append('catalog', this.general.catalog);
    formData.append('language', this.general.language);

    formData.append('summary', this.general.summary);
    formData.append('latestProducts', this.general.latestProducts);
    formData.append('info', this.general.info);
    formData.append('aboutUsText', this.general.aboutUsText);
    formData.append('cargo', this.general.cargo);
    formData.append('cargoText', this.general.cargoText);
    formData.append('privacyPolicy', this.general.privacyPolicy);
    formData.append('privacyPolicyText', this.general.privacyPolicyText);
    formData.append('newsletterHeader', this.general.newsletterHeader);
    formData.append('instagram', this.general.instagram);
    formData.append('facebook', this.general.facebook);
    formData.append('youtube', this.general.youtube);
    formData.append('linkedin', this.general.linkedin);
    formData.append('tweeter', this.general.tweeter);
    formData.append('copyright', this.general.copyright);
    formData.append('messageText', this.general.messageText);
    formData.append('namePlaceholder', this.general.namePlaceholder);
    formData.append('lastNamePlaceholder', this.general.lastNamePlaceholder);
    formData.append('phonePlaceholder', this.general.phonePlaceholder);
    formData.append('messagePlaceholder', this.general.messagePlaceholder);
    formData.append('contactText', this.general.contactText);
    formData.append('phoneText', this.general.phoneText);
    formData.append('mailText', this.general.mailText);
    formData.append('webAdress', this.general.webAdress);
    formData.append('address', this.general.address);
    formData.append('addressText', this.general.addressText);
    formData.append('workingHours', this.general.workingHours);
    formData.append('workingHoursText', this.general.workingHoursText);




    if (this.fileToUpload !== null) {
      formData.append('image', this.fileToUpload);
    } else {
      formData.append('image', this.general.imageUrl);
    }


    // if (this.fileToUploadTwo !== null) {
    //   formData.append('imageUrlTwo', this.fileToUploadTwo);
    // } else {
    //   formData.append('imageUrlTwo', this.general.imageUrlTwo);
    // }


    // if (this.fileToUploadThree !== null) {
    //   formData.append('imageUrlThree', this.fileToUploadThree);
    // } else {
    //   formData.append('imageUrlThree', this.general.imageUrlThree);
    // }

    if (this.generalId !== '0') {
      this.generalService.updated(this.generalId, formData, this.header)
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
      this.generalService.saved(formData, this.header)
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
    this.general.imageUrl = '';
    this.general.title = '';
    this.general.favicon = '';
    this.general.phone = '';
    this.general.mail = '';
    this.general.webAdress = '';
    this.general.address = '';
    this.general.aboutUs = '';
    this.general.privacyPolicy = '';
    this.general.instagram = '';
    this.general.facebook = '';
    this.general.youtube = '';
    this.general.linkedin = '';
    this.general.tweeter = '';


  }




  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    // this.confirmationService.confirm(this.general.imageUrl + ' - ' + this.general.title, 'Do you really want to delete it ?')
    //   .then((confirmed) => {
    //     if (confirmed === true) {
    //       this.delete();
    //     }
    //   })
    //   .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
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
