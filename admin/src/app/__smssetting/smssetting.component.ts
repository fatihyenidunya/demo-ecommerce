import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmsService } from '../_sms/sms.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { NgxIndexedDBService } from 'ngx-indexed-db';


@Component({
  selector: 'app-smssetting',
  templateUrl: './smssetting.component.html',
})
export class SmsSettingComponent implements OnInit {


  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  smsSetting = {
    company: '',
    api: '',
    userCode: '',
    password: '',
    msgHeader: '',
    _id: ''

  }

  disable = true;
  subEdit = false;

  header;
  smsSettings;

  constructor(private modalService: NgbModal, private ngxIndexedDBService: NgxIndexedDBService, private activeModal: NgbActiveModal, private smsService: SmsService) { }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.getSmsSettings(this.header);

    });

  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }




  public dismiss() {
    this.activeModal.dismiss();
  }

  getSmsSettings(header) {

    this.smsService.getSmsSettings(header).subscribe((res: any) => {
      this.smsSettings = res.smsSettings;
      console.log(this.smsSettings);
      this.disable = true;
    }, err => {
      if (err.status === 401) {

      } else {
        alert(JSON.stringify(err));
      }
    });


  }




  delete(smsSettingId): void {


    this.smsService.deleteSmsSetting(smsSettingId, this.header).subscribe((res: any) => {
      this.getSmsSettings(this.header);
    }, err => {
      if (err.status === 401) {

      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }


  getSmsSetting(smsSetting) {
    this.smsSetting = smsSetting;
  }


  newSmsSetting() {

    this.smsSetting.company = '';
    this.smsSetting.api = '';
    this.smsSetting.userCode = '';
    this.smsSetting.password = '';
    this.smsSetting.msgHeader = '';

    this.disable = false;


  }

  updateSmsSetting() {
    this.disable = false;
    this.subEdit = true;

  }

  saveSmsSetting() {
    this.disable = false;



    const formData = new FormData();
    formData.append('company', this.smsSetting.company);
    formData.append('api', this.smsSetting.api);
    formData.append('userCode', this.smsSetting.userCode);
    formData.append('password', this.smsSetting.password);
    formData.append('msgHeader', this.smsSetting.msgHeader);



    if (this.subEdit === true) {



      this.smsService.updateSmsSetting(this.smsSetting._id, formData, this.header)
        .subscribe((res: any) => {
          this.getSmsSettings(this.header);
          this.newSmsSetting();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {

          } else {
            alert(JSON.stringify(err));
          }
        });



    } else {
      this.smsService.saveSmsSetting(formData, this.header)
        .subscribe((res: any) => {
          this.getSmsSettings(this.header);
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {


          } else {
            alert(JSON.stringify(err));
          }
        });
    }
  }




  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}