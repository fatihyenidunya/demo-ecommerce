import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { User } from '../__auth/user.model';

import { NgForm } from '@angular/forms';
import { UserService } from '../__auth/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
  user: User;

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(private userService: UserService, private toastr: ToastrService) { }
  roles: any[];

  ngOnInit() {
    this.resetForm();
    this.userService.getAllRoles().subscribe(
      (data: any) => {
        data.forEach(obj => obj.selected = false);
        this.roles = data;
        console.log(JSON.stringify(data));
      }
    );
  }

  updateSelectedRoles(index) {
    this.roles[index].selected = !this.roles[index].selected;
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }
    this.user = {
      UserName: '',
      Password: '',
      Email: '',
      Customer: '',
      Officer: '',
      Country: '',
      Address: '',

      Phone: ''
    };

    if (this.roles) {
      this.roles.map(x => x.selected = false);
    }
  }

  OnSubmit(form: NgForm) {
    // tslint:disable-next-line:no-shadowed-variable
    const x = this.roles.filter(x => x.selected).map(y => y.name);


    this.userService.registerUser(form.value, x)
      .subscribe((data: any) => {
        console.log('user data is : ' + JSON.stringify(data));
        if (data.succeeded === true) {
          this.resetForm(form);
          this.toastr.success('User registration successful');
        } else {

        }
      }, err => {
        console.log('the  error ');
        this.toastr.error();
      });
  }

}
