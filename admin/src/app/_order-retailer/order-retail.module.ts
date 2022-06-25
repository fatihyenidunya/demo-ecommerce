import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRetailEditComponent } from './order-retail-edit/order-retail-edit.component';
import { OrderRetailListComponent } from './order-list/order-retail-list.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderRetailService } from './order-retail.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';



import { ErrorHandlerService } from '../__error/error-handler.service';



import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [ OrderRetailEditComponent,  OrderRetailListComponent,  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    OrderRoutingModule,
    NgxSpinnerModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ ],
  providers: [OrderRetailService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class OrderRetailModule { }
