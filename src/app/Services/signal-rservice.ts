import { Directive, Injectable } from "@angular/core";
import { NotificationMessage } from "../Models/notification-message";
import {Subject} from "rxjs";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { environment } from "../../environments/environment";
import { UserInfo } from "../Models/Dtos/user-dto";
import { CompleteMessage, ProgressMessage } from "../Models/progress-message";

@Directive()
@Injectable({
    providedIn: 'root',
})
export class SignalRService {

    message = new Subject<NotificationMessage>();
    failMsg = new Subject<NotificationMessage>();
    progressMsg = new Subject<ProgressMessage>();
    completeMsg = new Subject<CompleteMessage>();
    private _connection : any;

    connect(userName : string) {

        var url: string;
        url = environment.signalrUrl;

        this._connection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Information)
	    .withAutomaticReconnect()
        .withUrl(url)
        .build();

        this._connection.start()
        .catch(err => 
        {
           console.error(err);
  
           this.register(userName);
        })
           .then(()=>{
              this.register(userName);
        });
    }



    RegisterForSignalr()
    {
        this._connection.on("ProcessMessage", (message: NotificationMessage)=>
        {
         this.message.next(message);
        });

        this._connection.on("FailConversion", (message: NotificationMessage)=>
        {
         this.failMsg.next(message);
        });

        this._connection.on("ProgressMessage", (message: ProgressMessage)=>
        {
         this.progressMsg.next(message);
        });

        this._connection.on("CompleteMessage", (message: CompleteMessage)=>
        {
         this.completeMsg.next(message);
        });
    }

    private register(userName: string)
    {
        var parameter = new UserInfo();
        parameter.UserId = userName;

        this._connection.invoke('RegisterUser', parameter); //register user with signalr 
    }
}

