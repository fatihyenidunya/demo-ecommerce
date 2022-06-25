import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationEmailEditComponent } from './notificationemail-edit/notificationemail-edit.component';
import { NotificationEmailListComponent } from './notificationemail-list/notificationemail-list.component';
import { NotificationEmailRoutingModule } from './notificationemail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { NotificationEmailService } from './notificationemail.service';

@NgModule({
  declarations: [NotificationEmailEditComponent, NotificationEmailListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationEmailRoutingModule
  ],
  providers: [NotificationEmailService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class NotificationEmailModule { }
