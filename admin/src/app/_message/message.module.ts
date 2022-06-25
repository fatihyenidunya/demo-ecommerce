import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageEditComponent } from './message-edit/message-edit.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageRoutingModule } from './message-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { MessageService } from './message.service';

@NgModule({
  declarations: [MessageEditComponent, MessageListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MessageRoutingModule
  ],
  providers: [MessageService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class MessageModule { }
