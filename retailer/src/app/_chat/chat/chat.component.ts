import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ChatService } from '../chat.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../model/chat';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


    chat = new Chat();
    messages: any;
    messageDetail;
    sendedBy;
    sendedDate;

    successMessage;
    constructor(private chatService: ChatService,

        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections


    ) {
        this.chat.customerId = this.route.snapshot.params.id;



    }


    ngOnInit() {
        this.getMessages(this.chat.customerId);
        window.scrollTo(0, 0);

    }

    getMessages(customerId) {


        this.chatService.getMessages(customerId)
            .subscribe((res: any) => {
                this.messages = res.messages;
                console.log(this.messages)

            }, err => {

            });

    }


    showDetail(answer, userName, updatedAt, answered) {
        if (answered === true) {

            this.messageDetail = answer;
            this.sendedBy = 'Gönderen : ' + userName;
            this.sendedDate = updatedAt;
        }



    }

    OnSubmit(form: NgForm) {


        const formData = new FormData();
        formData.append('customer', this.chat.customerId);
        formData.append('message', this.chat.message);


        this.chatService.postMessage(formData)
            .subscribe((res: any) => {
                if (res.statusCode === 201) {

                    this.chat.message = '';
                }

            }, err => {

            });

    }

}
