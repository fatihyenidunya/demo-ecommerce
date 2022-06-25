import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { CartComponent } from './cart/cart.component';
import { CartRoutingModule } from './cart-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from './cart.service';
import { ErrorDialogService } from '../__error/error-dialog.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [CartComponent, PaymentComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CartRoutingModule,
    NgxSpinnerModule
  ],
  providers: [CartService, ErrorDialogService]
})
export class CartModule { }
