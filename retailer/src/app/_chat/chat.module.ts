import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatComponent } from './chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatService } from './chat.service';


@NgModule({
    declarations: [ChatComponent],
    imports: [
        CommonModule,
        ChatRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule

    ],
    providers: [
        ChatService
    ]

})
export class ChatModule { }
