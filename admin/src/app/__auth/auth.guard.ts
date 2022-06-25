import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable()
export class AuthGuard implements CanActivate {
  token;
  constructor(private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private userService: UserService) {


  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {


      if (user === undefined) {

        this.router.navigate(['/login']);

      } else {
        const roles = next.data['roles'] as Array<string>;
        if (roles) {
          const match = this.userService.roleMatch(roles);
          if (match) { return true; } else {

            this.router.navigate(['/login']);
            return false;
          }
        } else {

          return true;
        }

      }

    });

      return true;

  }
}
