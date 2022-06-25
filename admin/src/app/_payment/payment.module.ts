import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { PaymentService } from './payment.service';

@NgModule({
  declarations: [PaymentEditComponent, PaymentListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentRoutingModule
  ],
  providers: [PaymentService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class PaymentModule { }
