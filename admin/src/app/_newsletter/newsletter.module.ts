import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterEditComponent } from './newsletter-edit/newsletter-edit.component';
import { NewsletterListComponent } from './newsletter-list/newsletter-list.component';
import { NewsletterRoutingModule } from './newsletter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { NewsletterService } from './newsletter.service';

@NgModule({
  declarations: [NewsletterEditComponent, NewsletterListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NewsletterRoutingModule
  ],
  providers: [NewsletterService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class NewsletterModule { }
