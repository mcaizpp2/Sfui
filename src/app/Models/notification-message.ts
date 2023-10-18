import { SignalrMessageType } from './Enums/message-type'
export class NotificationMessage {

    body : string;
    subject : string;
    messages : string[] = [];
    messageType : SignalrMessageType
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
