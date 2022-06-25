import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberEditComponent } from './barber-edit/barber-edit.component';
import { BarberListComponent } from './barber-list/barber-list.component';
import { BarberRoutingModule } from './barber-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';

import { ErrorHandlerService } from '../__error/error-handler.service';
import { BarberService } from './barber.service';


@NgModule({
  declarations: [BarberEditComponent, BarberListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BarberRoutingModule
  ],
  providers: [BarberService,
    ErrorHandlerService]
})
export class BarberModule { }
