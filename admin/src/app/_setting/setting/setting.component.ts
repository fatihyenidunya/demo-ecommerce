import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../setting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Setting } from '../model/setting';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';


interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  nodejsApi;
  setting = new Setting();
  messages;
  comments;
  contacts;

  mngCargo = '';
  hiddenMng = true;
  isEditMng = false;

  tokenUrl = 'https://testapi.mngkargo.com.tr/mngapi/api/token';
  refreshTokenUrl = 'https://testapi.mngkargo.com.tr/mngapi/api/refresh/';

  userName = '58513164';
  password = 'BZDAMTEN';
  clientSecret = 'vW7lI7cT7mP0yO2tQ3sA3nE6wY1mG3lL8vM2oJ1cA3xM1hV6lP';
  clientId = '4845590b-515b-40d8-a2b8-838bb41dc1a7';

  refreshToken = '';
  bearerToken = '';


  orderEndPoint = 'https://testapi.mngkargo.com.tr/mngapi/api/standardqueryapi/getorder/';

  referenceId = '2488681252257792';


  constructor(private settingService: SettingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private confirmationService: ConfirmationDialogService

  ) {

    this.nodejsApi = appConnections.nodejsApi;


  }

  ngOnInit() {


    this.getSettingByCompany('MNG');

    // tslint:disable-next-line:max-line-length
    this.postToLoginMNG(this.tokenUrl, this.userName, this.password, 'ilajopap', this.clientSecret, this.clientId);

  }

  postToLoginMNG(tokenUrl, userName, password, apiVersion, clientSecret, clientId): void {

    this.settingService.postLoginToMNG(tokenUrl, userName, password, apiVersion, clientSecret, clientId).subscribe((res: any) => {

      console.log(res);



    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {

        if (err.error.error.code === '20014') {

          this.refreshToken = err.error.error.refreshToken;
          console.log(this.refreshToken);

          this.postRefreshMNGToken(this.refreshTokenUrl, this.refreshToken, apiVersion, clientSecret, clientId);
        }

      }
    });
  }



  postRefreshMNGToken(refreshTokenUrl, refreshToken, apiVersion, clientSecret, clientId): void {

    this.settingService.postRefreshMNGToken(refreshTokenUrl, refreshToken, apiVersion, clientSecret, clientId).subscribe((res: any) => {

      this.bearerToken = res.jwt;
      console.log(this.bearerToken);
      //  this.getOrderByReferenceId(this.orderEndPoint, this.referenceId, this.bearerToken, apiVersion, clientSecret, clientId);


    }, err => {


      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });
  }


  getOrderByReferenceId(endPoint, referenceId, bearerToken, apiVersion, clientSecret, clientId): void {

    // tslint:disable-next-line:max-line-length
    this.settingService.getOrderByReferenceId(endPoint, referenceId, bearerToken, apiVersion, clientSecret, clientId).subscribe((res: any) => {

      console.log(res);


    }, err => {

      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });
  }



  editMng(): void {

    this.isEditMng = true;

  }


  OnSubmitMng(form: NgForm) {


    const formData = new FormData();
    formData.append('company', 'MNG');
    formData.append('userName', this.setting.userName);
    formData.append('password', this.setting.password);


    if (this.mngCargo !== '') {
      this.settingService.update('MNG', formData)
        .subscribe((res: any) => {
          this.hiddenMng = false;
        }, err => {

        });
    } else {
      this.settingService.save(formData)
        .subscribe((res: any) => {

          this.hiddenMng = false;


        }, err => {
          // console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }

        });
    }
  }

  getSettingByCompany(company): void {
    this.settingService.get(company).subscribe((res: any) => {

      this.mngCargo = res.setting.company;
      this.setting = res.setting;




    }, err => {

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



}
