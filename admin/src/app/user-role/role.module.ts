import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleSignupRoutingModule } from './role-routing.module';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleListComponent } from './role-list/role-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { RoleService } from './role.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RoleSignupRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [ConfirmationDialogService, RoleService],
  declarations: [RoleEditComponent, RoleListComponent]
})
export class RoleModule { }
