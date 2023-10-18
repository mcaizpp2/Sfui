import { ApiBase } from "./api-base";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MediatorService } from "../Services/mediator.service";
import { ToastrService } from "ngx-toastr";
import {GetAllUsersResponse} from '../Models/Response/get-all-users-response';
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { ChangePwdResponse } from "../Models/Response/change-pwd-response";
import { ChangePwdRequest } from "../Models/Requests/change-pwd-request";
import { UserDto } from "../Models/Dtos/user-dto";
import { SaveUserResponse } from "../Models/Response/save-user-response";
import { DeleteUserRequest } from "../Models/Requests/delete-user-request";
import { DeleteUserResponse } from "../Models/Response/delete-user-response";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
  })
export class Userservice extends ApiBase {
    constructor(_mediatorService:MediatorService,_toastr: ToastrService, private _http: HttpClient ) 
    {
      super(_mediatorService, _toastr);
    }

    public async Get(userId : number): Promise<GetAllUsersResponse> 
    {
        var response = await this._http.get(API_URL + 'api/Users/Get/' + userId)
        .toPromise()
        .then(x=> x as GetAllUsersResponse)

        this.ProcessResponse(response);

        return response;
    }

    public async ChangePwd(changePwdRequest : ChangePwdRequest)  : Promise<ChangePwdResponse>
    {
    
        var requestPayLoad : string = JSON.stringify(changePwdRequest);
        let formData: FormData = new FormData();
        formData.append('request', requestPayLoad);
        var response = await this._http.post(API_URL + 'api/Users/changePwd', formData)
        .toPromise()
        .then(x=> x as ChangePwdResponse);

        this.ProcessResponse(response);
        
        return response;
    }

    public async DeleteUser(deleteUserRequest : DeleteUserRequest) : Promise<DeleteUserResponse>
    {
      var response = await this._http.delete(API_URL + 'api/Users/Delete/' + deleteUserRequest.UserId )
      .toPromise()
      .then(x=> x as DeleteUserResponse);

      this.ProcessResponse(response);
      
      return response;
    }

    public async Save(userDto : UserDto) : Promise<SaveUserResponse>
    {
      var requestPayLoad : string = JSON.stringify(userDto);
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      var response = await this._http.post(API_URL + 'api/Users/Save', requestPayLoad, {headers : headers})
      .toPromise()
      .then(x=> x as SaveUserResponse);

      this.ProcessResponse(response);
      
      return response;
    }
}