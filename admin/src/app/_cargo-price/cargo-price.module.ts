import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargoPriceEditComponent } from './cargo-price-edit/cargo-price-edit.component';
import { CargoPriceListComponent } from './cargo-price-list/cargo-price-list.component';
import { CargoPriceRoutingModule } from './cargo-price-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { CargoPriceService } from './cargo-price.service';

@NgModule({
  declarations: [CargoPriceEditComponent, CargoPriceListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CargoPriceRoutingModule
  ],
  providers: [CargoPriceService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class CargoPriceModule { }
