import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralEditComponent } from './general-edit/general-edit.component';
import { GeneralListComponent } from './general-list/general-list.component';
import { GeneralRoutingModule } from './general-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { GeneralService } from './general.service';

@NgModule({
  declarations: [GeneralEditComponent, GeneralListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralRoutingModule
  ],
  providers: [GeneralService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class GeneralModule { }
