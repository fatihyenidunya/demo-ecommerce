import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoEditComponent } from './video-edit/video-edit.component';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoRoutingModule } from './video-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { VideoService } from './video.service';

@NgModule({
  declarations: [VideoEditComponent, VideoListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    VideoRoutingModule
  ],
  providers: [VideoService, ConfirmationDialogService,
    ErrorHandlerService]
})
export class VideoModule { }
