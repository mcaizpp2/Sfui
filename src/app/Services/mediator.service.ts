import { Injectable, Output, EventEmitter, Directive } from '@angular/core';
import { ChkMessage } from '../Models/chk-message';
import { NotificationMessage } from '../Models/notification-message';
import { CompleteMessage, ProgressMessage } from '../Models/progress-message';

@Directive()
@Injectable({
  providedIn: 'root'
})
export class MediatorService {

  @Output() Notify : EventEmitter<NotificationMessage> = new EventEmitter();
  @Output() ConvFailed : EventEmitter<NotificationMessage> = new EventEmitter();
  @Output() Progressed : EventEmitter<ProgressMessage> = new EventEmitter();
  @Output() Refresh : EventEmitter<NotificationMessage> = new EventEmitter();
  @Output() Checked : EventEmitter<ChkMessage> = new EventEmitter();
  @Output() Complete : EventEmitter<CompleteMessage> = new EventEmitter();

  constructor() { }

  Publish(message : NotificationMessage)
  {
    this.Notify.emit(message);
  }

  ConvFail(message : NotificationMessage)
  {
    this.ConvFailed.emit(message);
  }
  
  ProgressSend(message : ProgressMessage)
  {
    this.Progressed.emit(message);
  }

  CompleteSend(message : CompleteMessage)
  {
    this.Complete.emit(message);
  }
}
