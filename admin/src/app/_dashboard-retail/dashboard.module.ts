import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { DashboardService } from './dashboard.service';
import { StatModule } from '../shared';
import { ReportDialogService } from '../__report/report-dialog.service';
import { ReportDialogComponent } from '../__report/report-dialog.component';

@NgModule({
  declarations: [DashboardComponent, ReportDialogComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    StatModule
  ],
  providers: [DashboardService, ConfirmationDialogService, ReportDialogService,
    ErrorHandlerService],
  entryComponents: [ReportDialogComponent]
})
export class DashboardModule { }
