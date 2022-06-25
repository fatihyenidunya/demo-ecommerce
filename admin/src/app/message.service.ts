import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from './messageModel';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    private info = new Subject<Message>();

    sendMessage(message: number) {



        this.subject.next({ text: message });
    }

    sendInfo(message: Message) {
        this.info.next(message);
    }

    clearMessages() {
        this.subject.next();
    }



    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getInfo(): Observable<Message> {
        return this.info.asObservable();
    }
}
