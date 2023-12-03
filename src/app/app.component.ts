import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './Data/authentication-service';
import { UserDto } from './Models/Dtos/user-dto';
import { MediatorService } from './Services/mediator.service';
import { SignalRService } from './Services/signal-rservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MorphUi';

  User : UserDto;
  messageSubscription: Subscription;
  convFailSubscription : Subscription;
  progressSubscription : Subscription;
  completeSubscription: Subscription;
  cleanseCompleteSubscription: Subscription;
 
  constructor(private _mediatorService: MediatorService,
    private _authenticationService : AuthenticationService,
    private _signalrService : SignalRService
  ) {

   }

  ngOnInit() {

    this.RefreshUser();
    this.initSignalr();

  }

   RefreshUser()
  {
    this.User = this._authenticationService.currentUserValue;
  }
  
  initSignalr() {

    this.User = this._authenticationService.currentUserValue;
    this._signalrService.connect(this.User.userName);
    this._signalrService.RegisterForSignalr();
    this.messageSubscription = this._signalrService.message.subscribe(msg => {  
      this._mediatorService.Publish(msg);
    });

    this.convFailSubscription = this._signalrService.failMsg.subscribe(msg => {  

      this._mediatorService.ConvFail(msg);
      this._mediatorService.Publish(msg);
    });

    this.progressSubscription = this._signalrService.progressMsg.subscribe(msg => {  
  
      this._mediatorService.ProgressSend(msg);

    });

    this.completeSubscription = this._signalrService.completeMsg.subscribe(msg => {  
  
      this._mediatorService.CompleteSend(msg);

    });
    debugger;
    this.cleanseCompleteSubscription = this._signalrService.cleanseCompleteMsg.subscribe(msg => {

      this._mediatorService.CleanseCompleteSend(msg);

    });

   
  }
}


