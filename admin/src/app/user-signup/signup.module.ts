import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupEditComponent } from './signup-edit/signup-edit.component';
import { SignupListComponent } from './signup-list/signup-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { RoleService } from '../user-role/role.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SignupRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [ConfirmationDialogService, RoleService],
  declarations: [SignupEditComponent, SignupListComponent]
})
export class SignupModule { }
