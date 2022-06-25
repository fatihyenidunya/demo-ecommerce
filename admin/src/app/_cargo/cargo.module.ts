import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargoListComponent } from './cargo-list/cargo-list.component';
import { CargoEditComponent } from './cargo-edit/cargo-edit.component';
import { ShipmentRoutingModule } from './cargo-routing.module';
import { CargoService } from './cargo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ConfirmationCargoService } from '../__confirm-cargo/confirmation-cargo.service';
import { ErrorHandlerService } from '../__error/error-handler.service';


@NgModule({
  declarations: [CargoListComponent, CargoEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ShipmentRoutingModule,

  ],
  providers: [CargoService, ConfirmationDialogService, ConfirmationCargoService,
    ErrorHandlerService]
})
export class CargoModule { }
