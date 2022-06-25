import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatEditComponent } from './chat-edit/chat-edit.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRoutingModule } from './chat-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { ChatService } from './chat.service';

@NgModule({
  declarations: [ChatEditComponent, ChatListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ChatRoutingModule
  ],
  providers: [ChatService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class ChatModule { }
