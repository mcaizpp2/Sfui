import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../Data/authentication-service';
import { ChangePwdRequest } from '../../Models/Requests/change-pwd-request';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent implements OnInit {
  public PwdForm: FormGroup;

  private _returnUrl : string;
  constructor(private _formBuilder: FormBuilder, 
    private _authenticationService : AuthenticationService,
    private _router : Router,
    private _route: ActivatedRoute) { }


  ngOnInit() {

    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] 

    this.PwdForm = this._formBuilder.group({
      password: ['', Validators.required],
      confirm: ['']
    }, { validator: this.checkPasswords });
  }

 
  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirm.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  public async OnSubmit() 
  {
    var ctrls = this.PwdForm.controls;

    var pwd = ctrls['password'].value;
    var request = new ChangePwdRequest({ Pwd : pwd });
    var response = await this._authenticationService.ChangePwd(request);

    if (response.status)
    {
  
      if (!this._returnUrl)
        this._returnUrl = "/manager";

      this._router.navigate([this._returnUrl]);

    }
  }

}
