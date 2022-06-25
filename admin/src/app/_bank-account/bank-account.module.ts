import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountEditComponent } from './bank-account-edit/bank-account-edit.component';
import { BankAccountRoutingModule } from './bank-account-routing.module';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';

import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { BankAccountService } from './bank-account.service';




@NgModule({
  declarations: [BankAccountEditComponent, BankAccountListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BankAccountRoutingModule
  ],
  providers: [BankAccountService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class BankAccountModule { }
