import { Component, OnInit } from '@angular/core';

import { Role } from '../model/role';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { UserService } from '../../__auth/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { AppConnections } from '../../app.connections';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { RoleService } from '../role.service';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];



@Component({
  selector: 'app-role',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss'],
  animations: [routerTransition()]
})
export class RoleEditComponent implements OnInit {




  public disable = true;
  public isEdit = false;

  public thisModule;
  public apiBaseUrl;

  public info = '';
  roleId;
  counter: number;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public role = new Role();
  header;
  hide = false;

  // tslint:disable-next-line:max-line-length
  constructor(private roleService: RoleService, private ngxIndexedDBService: NgxIndexedDBService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private simpleTimer: SimpleTimer, private toastr: ToastrService) {




  }


  ngOnInit() {



    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.resetForm();
      this.prepare(this.header);

    });



  }


  prepare(header) {
    this.alertReset();
    this.counter = 3;
    this.roleId = this.route.snapshot.params['id'];
    if (this.roleId !== '0') {
      this.roleService.getRole(this.roleId, header).subscribe((res: any) => {
        this.role = res.userRole;

        if (this.role.userRole === 'Manager' ) {
          this.hide = true;
        }
        if (this.role.userRole === 'Admin' ) {
          this.hide = true;
        }


      }, err => {

        this.showError(err.message);
      });

    } else {
      this.disable = false;
      this.cleanData();
    }
  }






  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }
    this.role = {

      userRole: ''


    };


  }




  OnSubmit(form: NgForm) {
    const formData = new FormData();
    formData.append('role', this.role.userRole);

    this.roleService.saved(formData, this.header)
      .subscribe((res: any) => {
        this.toastr.success('Role registration is successed');
        this.resetForm();
      }, err => {

        this.showError(err.message);
      });


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


  userDelete(): void {



    this.roleService.roleDelete(this.roleId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../user-role']);
    }, err => {
      this.showError(err.error);
    });

  }

  cleanData() {
    this.resetForm();

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

  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

}
