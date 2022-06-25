import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorListComponent } from './error-list/error-list.component';
import { ErrorEditComponent } from './error-edit/error-edit.component';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorService } from './error.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';

import { ErrorHandlerService } from '../__error/error-handler.service';
import { OrderProductRetailerTransactionService } from '../__order-product-retailer-transaction/order-product-retailer-transaction.service';
import { OrderProductRetailerTransactionComponent } from '../__order-product-retailer-transaction/order-product-retailer-transaction.component';
import { ConfirmationCargoService } from '../__confirm-cargo/confirmation-cargo.service';
import { ConfirmationCargoComponent } from '../__confirm-cargo/confirmation-cargo.component';


@NgModule({
  declarations: [ErrorListComponent, ConfirmationCargoComponent, OrderProductRetailerTransactionComponent, ErrorEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ErrorRoutingModule
  ],

  providers: [ErrorService, ConfirmationCargoService, OrderProductRetailerTransactionService, ConfirmationDialogService,
    ErrorHandlerService],
  entryComponents: [OrderProductRetailerTransactionComponent, ConfirmationCargoComponent]
})
export class ErrorModule { }
