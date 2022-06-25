import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailEditComponent } from './email-edit/email-edit.component';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailRoutingModule } from './email-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { EmailService } from './email.service';

@NgModule({
  declarations: [EmailEditComponent, EmailListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    EmailRoutingModule
  ],
  providers: [EmailService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class EmailModule { }
