import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargoCompanyEditComponent } from './cargo-company-edit/cargo-company-edit.component';
import { CargoCompanyListComponent } from './cargo-company-list/cargo-company-list.component';
import { CargoCompanyRoutingModule } from './cargo-company-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { CargoCompanyService } from './cargo-company.service';

@NgModule({
  declarations: [CargoCompanyEditComponent, CargoCompanyListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CargoCompanyRoutingModule
  ],
  providers: [CargoCompanyService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class CargoCompanyModule { }
