import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsListComponent } from './sms-list/sms-list.component';
import { SmsRoutingModule } from './sms-routing.module';
import { SmsService } from './sms.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ConfirmationCargoService } from '../__confirm-cargo/confirmation-cargo.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { SmsSettingComponent } from '../__smssetting/smssetting.component';
import { SmsSettingService } from '../__smssetting/smssetting.service';

@NgModule({
  declarations: [SmsListComponent, SmsSettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SmsRoutingModule,

  ],
  providers: [SmsService, SmsSettingService, ConfirmationDialogService, ConfirmationCargoService,
    ErrorHandlerService],
  entryComponents: [SmsSettingComponent]
})
export class SmsModule { }
