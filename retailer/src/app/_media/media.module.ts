import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MediaComponent } from './media/media.component';
import { MediaRoutingModule } from './media-routing.module';
import { MediaService } from './media.service';


@NgModule({
    declarations: [MediaComponent],
    imports: [
        CommonModule,
        MediaRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        MediaService
    ]

})
export class MediaModule { }
