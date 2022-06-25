import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotComponent } from './notAuth/not.component';
import { NotRoutingModule } from './not-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ErrorHandlerService } from '../__error/error-handler.service';


@NgModule({
  declarations: [NotComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NotRoutingModule
  ],
  providers: [
    ErrorHandlerService]
})
export class NotModule { }
