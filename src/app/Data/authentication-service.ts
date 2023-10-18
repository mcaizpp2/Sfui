import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserDto } from "../Models/Dtos/user-dto";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ApiBase } from "./api-base";
import { MediatorService } from "../Services/mediator.service";
import { ToastrService } from "ngx-toastr";
import { AuthenticateResponse } from "../Models/Response/authenticate-response";
import { AuthenticateRequest} from "../Models/Requests/authenticate-request";
import { ChangePwdRequest} from "../Models/Requests/change-pwd-request";
import { ChangePwdResponse } from "../Models/Response/change-pwd-response";
import * as CryptoJS from '../../../node_modules/crypto-js'; 

const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root' })
export class AuthenticationService extends ApiBase {
    private _currentUserSubject: BehaviorSubject<UserDto>;
    public _currentUser: Observable<UserDto>;
    private _firstTimeUser : UserDto;

    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
        this._currentUserSubject = new BehaviorSubject<UserDto>(JSON.parse(localStorage.getItem('currentUser')));
        this._currentUser = this._currentUserSubject.asObservable();
    }

   

    public get currentUserValue(): UserDto {
        return this._currentUserSubject.value;
    }

    public async Login(authenticateRequest : AuthenticateRequest) : Promise<AuthenticateResponse>
    {
    
        var key = CryptoJS.enc.Hex.parse(environment.encryptKey);
        var iv = CryptoJS.enc.Hex.parse(environment.iv);
        var encrypted = CryptoJS.AES.encrypt(authenticateRequest.Pwd, key, {iv: iv, padding: CryptoJS.pad.NoPadding}).toString();
 
        authenticateRequest.Pwd = encrypted;
        var requestPayLoad : string = JSON.stringify(authenticateRequest);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        var response = await this._http.post(API_URL + 'api/users/authenticate', requestPayLoad, {headers : headers})
        .toPromise()
        .then(x=> x as AuthenticateResponse);

        this.ProcessResponse(response);
        
        if (response.status && response.changePwd == false)
        {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this._currentUserSubject.next(response.user);
        }

        if (response.status && response.changePwd)
            this._firstTimeUser = response.user;

        return response;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this._currentUserSubject.next(null);
    }

    public async ChangePwd(changePwdRequest : ChangePwdRequest)  : Promise<ChangePwdResponse>
    {
        var key = CryptoJS.enc.Hex.parse(environment.encryptKey);
        var iv = CryptoJS.enc.Hex.parse(environment.iv);
        var encrypted = CryptoJS.AES.encrypt(changePwdRequest.Pwd, key, {iv: iv, padding: CryptoJS.pad.NoPadding}).toString();
 
        changePwdRequest.Pwd = encrypted;
        changePwdRequest.UserId = this._firstTimeUser.userId;
        var requestPayLoad : string = JSON.stringify(changePwdRequest);
        let formData: FormData = new FormData();
        formData.append('request', requestPayLoad);
        var response = await this._http.post(API_URL + 'api/users/changePwd', formData)
        .toPromise()
        .then(x=> x as ChangePwdResponse);

        this.ProcessResponse(response);
        
        if (response.status)
        {
            localStorage.setItem('currentUser', JSON.stringify(this._firstTimeUser));
            this._currentUserSubject.next(this._firstTimeUser);
        }
        return response;
    }
}
