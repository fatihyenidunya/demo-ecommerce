import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { UserService } from '../__auth/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { User } from '../user-signup/model/user';
import { AppConnections } from '../app.connections';
import {  NgxIndexedDBService } from 'ngx-indexed-db';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  isLoginError = false;
  user = new User();


  constructor(private appConnections: AppConnections, private ngxIndexedDBService: NgxIndexedDBService, private userService: UserService, private router: Router) { }

  ngOnInit() {




  }

  // OnSubmit(userName, password) {
  //     this.userService.userAuthentication(userName, password).subscribe((data: any) => {
  //       console.log('data is : ' + JSON.stringify(data));
  //      localStorage.setItem('userToken', data.access_token);
  //      localStorage.setItem('userRoles', data.role);
  //      this.router.navigate(['/admin']);
  //    },
  //    (err: HttpErrorResponse) => {
  //      this.isLoginError = true;
  //    });
  //  }



  OnSubmit(form: NgForm) {

    const formData = new FormData();
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);






    this.userService.userAuthenticationd(formData).subscribe((res: any) => {


     this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {


        if (user === undefined) {

          this.ngxIndexedDBService
            .add('users', {
              oUserId: res.userId,
              oUserToken: res.token,
              oUserName: res.userName,
              oUserRole: res.role
            })
            .subscribe((key) => {
              this.router.navigate(['']);
            });
        } else {

          if (user.oUserRole !== res.oUserRole) {

            this.ngxIndexedDBService
              .update('users', {
                id: 1,
                oUserId: res.userId,
                oUserToken: res.token,
                oUserName: res.userName,
                oUserRole: res.role
              })
              .subscribe((key) => {
                this.router.navigate(['']);
              });
          }
        }


      });




      // localStorage.setItem('userId', res.userId);
      // localStorage.setItem('userToken', res.token);
      // localStorage.setItem('userName', res.userName);
      // this.appConnections.userRole = res.role;





    },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
      });
  }



}
