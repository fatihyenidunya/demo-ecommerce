import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuComponent } from './menu/menu.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { NotRoutingModule } from './menu-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from './menu.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { RoleService } from '../user-role/role.service';


@NgModule({
  declarations: [MenuComponent, MenuEditComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NotRoutingModule
  ],
  providers: [MenuService, RoleService,
    ErrorHandlerService]
})
export class MenuModule { }
