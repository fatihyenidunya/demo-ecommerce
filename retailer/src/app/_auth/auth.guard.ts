import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';



@Injectable()
export class AuthGuard implements CanActivate {
    token;
    customerName;
    customerId;
    constructor(private router: Router) {


    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        this.customerName = localStorage.getItem('customerName');

        this.customerId = localStorage.getItem('customerId');

        // alert(this.customerId);

        if (this.customerId === null) {

            this.router.navigate(['/login']);

        } else {
            return true;

        }

    }
}
