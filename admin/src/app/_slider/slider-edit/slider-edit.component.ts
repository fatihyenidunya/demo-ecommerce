import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SliderService } from '../slider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Slider } from '../model/slider';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-slider-edit',
  templateUrl: './slider-edit.component.html',
  styleUrls: ['./slider-edit.component.scss']
})
export class SliderEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  nodejsApi;
  public info = '';
  public slider = new Slider();
  counter: number;
  sliderId;

  fileToUpload: File = null;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  header;
  imageApi;
  constructor(private sliderService: SliderService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService

  ) {



    this.thisModule = this.sliderService.moduleName;
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

    this.sliderService.deleted(this.sliderId, this.header).subscribe((res: any) => {
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
    this.sliderId = this.route.snapshot.params['id'];
    if (this.sliderId !== '0') {
      this.sliderService.getd(this.sliderId, header).subscribe((res: any) => {
        this.slider = res.slider;

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
    formData.append('imageUrl', this.slider.imageUrl);
    formData.append('title', this.slider.title);
    formData.append('description', this.slider.description);
    formData.append('link', this.slider.link);
    formData.append('order', this.slider.order.toString());
    if (this.fileToUpload !== null) {
      formData.append('image', this.fileToUpload);
    } else {
      formData.append('image', this.slider.imageUrl);
    }

    if (this.sliderId !== '0') {
      this.sliderService.updated(this.sliderId, formData, this.header)
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
      this.sliderService.saved(formData, this.header)
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
    this.slider.imageUrl = '';
    this.slider.title = '';
    this.slider.description = '';
    this.slider.order = 0;


  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.slider.title, 'Do you really want to delete it ?')
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
