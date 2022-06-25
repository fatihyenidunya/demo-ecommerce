import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseRetailListComponent } from './warehouse-retail-list/warehouse-retail-list.component';
import { WarehouseRetailEditComponent } from './warehouse-retail-edit/warehouse-retail-edit.component';
import { WarehouseRetailRoutingModule } from './warehouse-routing.module';
import { WarehouseRetailService } from './warehouse-retail.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';

import { ErrorHandlerService } from '../__error/error-handler.service';
import { OrderProductRetailerTransactionService } from '../__order-product-retailer-transaction/order-product-retailer-transaction.service';
import { OrderProductRetailerTransactionComponent } from '../__order-product-retailer-transaction/order-product-retailer-transaction.component';
import { ConfirmationCargoService } from '../__confirm-cargo/confirmation-cargo.service';
import { ConfirmationCargoComponent } from '../__confirm-cargo/confirmation-cargo.component';


@NgModule({
  declarations: [WarehouseRetailListComponent, ConfirmationCargoComponent, OrderProductRetailerTransactionComponent, WarehouseRetailEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    WarehouseRetailRoutingModule
  ],

  providers: [WarehouseRetailService, ConfirmationCargoService, OrderProductRetailerTransactionService, ConfirmationDialogService,
    ErrorHandlerService],
  entryComponents: [OrderProductRetailerTransactionComponent, ConfirmationCargoComponent]
})
export class WarehouseRetailModule { }
