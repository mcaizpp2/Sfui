import { Injectable, Output, EventEmitter, Directive } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Directive()
@Injectable({ providedIn: 'root' })
export class MessageService {
    @Output() Loading : EventEmitter<boolean> = new EventEmitter();
    private subject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    LoadingMsg(status : boolean)
    {
        this.Loading.emit(status);
    }
}
