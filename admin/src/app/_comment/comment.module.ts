import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentEditComponent } from './comment-edit/comment-edit.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentRoutingModule } from './comment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { CommentService } from './comment.service';

@NgModule({
  declarations: [CommentEditComponent, CommentListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommentRoutingModule
  ],
  providers: [CommentService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class CommentModule { }
