import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../menu.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';

import { AppConnections } from '../../app.connections';
import { Menu } from '../model/menu';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgForm } from '@angular/forms';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent implements OnInit {
  public disable = true;
  public isEdit = false;

  public thisModule;
  public apiBaseUrl;
  public picUrl;
  public info = '';
  public menu = new Menu();
  counter: number;
  customId;
  menuId;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  constructor(private menuService: MenuService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiConnections: AppConnections,
    private simpleTimer: SimpleTimer


  ) {


    this.thisModule = this.menuService.moduleName;

    this.prepare();

  }

  ngOnInit() {
  }



  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }

  delete(): void {

    this.menuService.deleted(this.customId).subscribe((res: any) => {
      this.router.navigate(['../../../admin/', this.thisModule]);
    }, err => {
      this.showError(err.error);
    });

  }

  prepare() {
    this.alertReset();
    this.counter = 3;
    this.menuId = this.route.snapshot.params['id'];


    if (this.menuId !== '0') {
      this.menuService.getd(this.menuId).subscribe((res: any) => {
        this.menu = res.menu;

      }, err => {

        this.showError(err.message);
      });

    } else {
      this.disable = false;
      this.cleanData();
    }
  }


  OnSubmit(form: NgForm) {


    const formData = new FormData();
    formData.append('link', this.menu.link);
    formData.append('icon', this.menu.icon);

    formData.append('name', this.menu.name);


    if (this.menuId !== '0') {
      this.menuService.updated(this.menuId, formData)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          this.showError(err);
        });
    } else {
      this.menuService.saved(formData)
        .subscribe((res: any) => {
          this.showInfo();

        }, err => {
          console.log('the error ' + JSON.stringify(err));
          this.showError(err);
        });
    }
  }


  cleanData() {
    this.menu.link = '';
    this.menu.icon = '';
    this.menu.name = '';


  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
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
        this.router.navigate(['../../../admin/', this.thisModule]);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }




}
