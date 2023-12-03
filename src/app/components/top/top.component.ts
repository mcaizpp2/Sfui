import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MessageService } from '../../Services/message-service';
import { AuthenticationService } from '../../Data/authentication-service';
import { Router } from '@angular/router';
import { MediatorService } from '../../Services/mediator.service';
import { UserDto } from '../../Models/Dtos/user-dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, timer } from 'rxjs';
import { SignalRService } from '../../Services/signal-rservice';
import { NotificationMessage } from '../../Models/notification-message';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  @ViewChild('confirm',{static: true}) confirmElement : TemplateRef<any>;

  public show = true;
  public isLogged : boolean;
  public Selected = 1;
  public Progress = 0;
  public isAdmin : boolean;
  private _interval : NodeJS.Timer;
  private _closeInterval : NodeJS.Timer;
  public User: UserDto;
  private _isRunning = false;

  messageSubscription: Subscription;

  private lpScription: Subscription;

  private _obsTimer: Observable<number> = timer(1000, 1000);

  constructor(private _messageService: MessageService, 
    private _authenticationService : AuthenticationService,
    private _router : Router, private _mediatorService : MediatorService,
    private _modalService: NgbModal,private toastr: ToastrService,
    public Router: Router) { }

  ngOnInit() {

    this._mediatorService.Refresh.subscribe(x=>
      {
        this.RefreshUser();
      });

    this.RefreshUser(); 
    
    this._messageService.Loading.subscribe(status=>
      {
        this.load(status);
      });

      this._mediatorService.Notify.subscribe(message =>
        {

          var html = this.createMessageHtml(message);
    
          this.toastr.error(html, "", {
            enableHtml: true,
            positionClass: 'toast-top-left',
            closeButton: true,
            timeOut: 100000
          });
          this.toastr.show();
        });
  }

  RefreshUser()
  {
    this.User = this._authenticationService.currentUserValue;
    if (this.User)
    {
      this.isLogged = true;
      if (this.User.userType.userTypeId >= 2)
        this.isAdmin = true;
    }
  }

  LogOut()
  {
    this._modalService.open(this.confirmElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  Confirm()
  {
    this._authenticationService.logout();
    this.isLogged = false;
    this.isAdmin = false;
    this._router.navigate(['/login']);
    this._modalService.dismissAll();
  }

  Cancel()
  {
    this._modalService.dismissAll();
  }
  private async load(status: boolean) {
    if (status) {

      this.lpScription = this._obsTimer.subscribe(val => {
        if (this.Progress >= 100) {
          this.Progress = 0;
        } else {

          this.Progress += 10;
        }
      });
    }

    if (!status) {

      while (this.Progress < 100) {
        this.Progress += 3;
        await this.timeout(50);
      }

      this.Progress = 0;
      if (this.lpScription)
        this.lpScription.unsubscribe();
    }

  }

  private timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //private load(status : boolean)
  //{

  //   if (this._interval && status)
  //   {
  //     clearInterval(this._interval);
  //   }

  //    if (status) {
  //      this._interval = setInterval(() => {
  //        if (this.Progress >= 100) {
  //          this.Progress = 0;
  //        } else {
  //          this.Progress++;
  //        }
  //      }, 100);
  //    }
  //    else {
  //      clearInterval(this._interval);
  //      this.stop();
  //    }
  //}


  private stop()
  {
    this._closeInterval = setInterval(() => {

      this.Progress+=3;
      if (this.Progress > 100)
      {
        this.Progress = 0;
        clearInterval(this._closeInterval);

      }
    }, 30);  
  }

  createMessageHtml(message : NotificationMessage) : string
  {
    
    var messageHtml : string;
    var titleClass="";
    switch(message.messageType) 
    {
      case 1:
        titleClass="infoTitle";
        break;
      case 2:
        titleClass="errorTitle";
        break;
      case 3:
        titleClass="successTitle";

        break;
    }
  
    messageHtml = '<table class=toastTbl><tr><td class=' + titleClass + '>' + message.subject + '</td></tr>';

    messageHtml = messageHtml + '<tr><td class=messageBody>' + message.body + '</td></tr>' ;

    if (message.messages)
    {
      if (message.messages.length > 0)
      {
        messageHtml = messageHtml + '<tr><td class=messageBody>The following errors occured - </td></tr>'
        message.messages.forEach(x=> 
        {
          messageHtml = messageHtml + '<tr><td class=messageBody>' + x + '</td></tr>' ;
        });
      
      }
    }

    messageHtml = messageHtml + '</table>';
    return messageHtml;
    
  }
}
