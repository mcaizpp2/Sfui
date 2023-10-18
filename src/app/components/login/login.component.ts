import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, SelectControlValueAccessor } from '@angular/forms';
import { AuthenticationService} from '../../Data/authentication-service';
import { AuthenticateRequest} from "../../Models/Requests/authenticate-request";
import { Router, ActivatedRoute } from '@angular/router';
import { MediatorService } from '../../Services/mediator.service';
import { NotificationMessage } from '../../Models/notification-message';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public LoginForm: FormGroup;
  private _returnUrl : string; 

  constructor(private _formBuilder: FormBuilder,
     private _authenticationService : AuthenticationService,
     private _router : Router, private _mediatorService  : MediatorService,
     private _route: ActivatedRoute) { }

  ngOnInit() {

    //debugger;
    //this._authenticationService.logout();
    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] 
    this.LoginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
  });
  }

  public async OnSubmit() {

    var ctrls = this.LoginForm.controls;

    var userName = ctrls['username'].value;
    var pwd = ctrls['password'].value;
    var authenticateRequest = new AuthenticateRequest({ userName: userName, Pwd : pwd });
    var response = await this._authenticationService.Login(authenticateRequest);

   
    if (!response.status)
      return; 

    this._mediatorService.Publish(new NotificationMessage ({ Subject: "Successful Login", Refresh : true, body : "" }));

    if (!this._returnUrl)
      this._returnUrl = "manager";

    if (response.changePwd)
      this._router.navigate(['/changePwd'],{ queryParams: { returnUrl: this._returnUrl } } );
    else
      this._router.navigate([this._returnUrl]);
  }

}
