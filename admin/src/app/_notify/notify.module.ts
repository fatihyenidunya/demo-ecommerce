import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ErrorHandlerService } from '../__error/error-handler.service';
import { NotifyService } from './notify.service';
import { NotifyListComponent } from './notify-list/notify-list.component';

import { NotifyRoutingModule } from './notify-routing.component';

@NgModule({
  declarations: [NotifyListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NotifyRoutingModule

  ],
  providers: [NotifyService,
    ErrorHandlerService]
})
export class NotifyModule { }
