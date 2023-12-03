import { SignalrMessageType } from "./Enums/message-type";

export class ProgressMessage {

    title : string;
    progress : number;
    complete : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class CleanseCompleteMessage {

  cleanseMgrId: number;
  body: string;
  subject: string;
  messages: string[] = [];
  messageType: SignalrMessageType;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
export class CompleteMessage {


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

