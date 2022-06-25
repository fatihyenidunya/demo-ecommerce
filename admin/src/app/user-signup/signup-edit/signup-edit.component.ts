import { Component, OnInit } from '@angular/core';

import { User } from '../model/user';
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
import { RoleService } from '../../user-role/role.service';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];



@Component({
  selector: 'app-signup',
  templateUrl: './signup-edit.component.html',
  styleUrls: ['./signup-edit.component.scss'],
  animations: [routerTransition()]
})
export class SignupEditComponent implements OnInit {




  public disable = true;
  public isEdit = false;

  public thisModule;
  public apiBaseUrl;
  public picUrl;
  public info = '';
  userId;
  counter: number;

  alerts: Alert[] = [{
    type: '',
    message: '',
  }];

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  public user = new User();
  header;
  public roles;

  selectedRole;
  constructor(private appConnections: AppConnections, private roleService: RoleService , private ngxIndexedDBService: NgxIndexedDBService, private userService: UserService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private simpleTimer: SimpleTimer, private toastr: ToastrService) {




  }

  getRoles() {
    this.roleService.getRoles(this.header).subscribe((res: any) => {
      this.roles = res.roles;
      });
  }


  ngOnInit() {



    this.thisModule = this.userService.moduleName;

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.resetForm();
      this.prepare(this.header);

      this.getRoles();

    });



  }


  prepare(header) {
    this.alertReset();
    this.counter = 3;
    this.userId = this.route.snapshot.params['id'];
    if (this.userId !== '0') {
      this.userService.getUser(this.userId, header).subscribe((res: any) => {
        this.user = res.user;
        this.selectedRole = this.user.role;


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
    this.user = {
      userName: '',
      password: '',
      email: '',
      role: ''


    };


  }




  selectRole(status) {

    this.selectedRole = status;


  }

  OnSubmit(form: NgForm) {
    const formData = new FormData();
    formData.append('userName', this.user.userName);
    formData.append('password', this.user.password);
    formData.append('email', this.user.email);
    formData.append('role', this.selectedRole);



    this.userService.saved(formData, this.header)
      .subscribe((res: any) => {
        this.toastr.success('User registration is successed');
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

    this.userService.userDelete(this.userId, this.header).subscribe((res: any) => {
      this.router.navigate(['../../user-signup']);
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
