import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccountService } from '../bank-account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { BankAccount } from '../model/bankAccount';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgxIndexedDBService } from 'ngx-indexed-db';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-volume-edit',
  templateUrl: './bank-account-edit.component.html',
  styleUrls: ['./bank-account-edit.component.scss']
})
export class BankAccountEditComponent implements OnInit {

  public disable = true;
  public isEdit = false;
  public uploadPath = 'volume';

  header;
  public thisModule;
  public apiBaseUrl;
  public picUrl;
  public info = '';
  accountId;
  public bankAccount = new BankAccount();
  selectedCurrency;
  counter: number;

  public currencies;
  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private bankAccountService: BankAccountService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private confirmationService: ConfirmationDialogService,
    private ngxIndexedDBService: NgxIndexedDBService

  ) {


    this.apiBaseUrl = this.apiConnections.api;
    this.thisModule = this.bankAccountService.moduleName;
    this.currencies = this.apiConnections.currencies;
    this.selectedCurrency = this.apiConnections.selectedCurrency;
    this.bankAccount.currency = this.selectedCurrency;

    this.prepare();

  }

  ngOnInit() {


    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;



    });
  }



  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.bankAccountService.delete(this.accountId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../', this.thisModule]);
    }, err => {
      this.showError(err.error);
    });

  }

  prepare() {
    this.alertReset();
    this.counter = 3;
    this.accountId = this.route.snapshot.params.id;

    if (this.accountId !== '0') {

      this.bankAccountService.get(this.accountId, this.header).subscribe((res: any) => {
        this.bankAccount = res.account;
        this.selectedCurrency = res.account.currency;
      }, err => {

        this.showError(err.error);
      });

    } else {


      this.disable = false;
      this.cleanData();
    }
  }


  opeation(): void {
    if (this.isEdit === true) {
      this.update();
    } else {
      this.save();
    }
  }

  update() {
    // this.country.flag=this.picUrl;
    this.bankAccountService.update(this.accountId, this.bankAccount, this.header).subscribe((res: any) => {
      this.showInfo();

    }, err => {
      this.showError(err.error);
    });
  }

  save() {
    this.bankAccountService.save(this.bankAccount, this.header).subscribe((res: any) => {
      this.disable = true;
      this.showInfo();

    }, err => {
      this.showError(err.error);
    });
  }
  cleanData() {


  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete() {

    this.confirmationService.confirm(this.bankAccount.accountNo, 'Do you really want to delete it ?')
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

  selectCurrency(currency) {
    this.bankAccount.currency = currency;
  }

  alertReset() {
    this.alerts = Array.from(ALERTS);
  }

  callback() {
    this.counter--;
    if (this.counter === 0) {
      this.simpleTimer.delTimer('3sec');
      if (this.isEdit === true) {
        this.router.navigate(['../../', this.thisModule]);
      } else {
        this.alertReset();
        this.cleanData();
        this.router.navigate(['../../', this.thisModule]);
      }
    }
  }





}
