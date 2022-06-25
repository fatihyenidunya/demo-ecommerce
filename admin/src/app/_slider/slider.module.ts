import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderEditComponent } from './slider-edit/slider-edit.component';
import { SliderListComponent } from './slider-list/slider-list.component';
import { SliderRoutingModule } from './slider-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { SliderService } from './slider.service';

@NgModule({
  declarations: [SliderEditComponent, SliderListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SliderRoutingModule
  ],
  providers: [SliderService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class SliderModule { }
