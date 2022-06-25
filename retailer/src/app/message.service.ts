import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MessageService {
    private subject = new Subject<any>();

    private dismiss = new Subject<any>();

    private info = new Subject<string>();

    sendMessage(message: number) {
        this.subject.next({ text: message });
    }
 

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    sendDissmissSignal(signal) {
        this.dismiss.next({ close: signal});
    }
    getDissmissSignal(): Observable<any> {
        return this.dismiss.asObservable();
    }
  
}
