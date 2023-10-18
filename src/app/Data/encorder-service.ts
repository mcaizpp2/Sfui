import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { GetEncoderResponse } from "../Models/Response/get-encoder-response";
import { MediatorService } from "../Services/mediator.service";
import { ApiBase } from "./api-base";
import { CreateEncoderResponse } from "../Models/Response/create-template-response";
import { CreateEncoderRequest } from "../Models/Requests/create-encoder-request";

const API_URL = environment.apiUrl;
@Injectable({ providedIn: 'root' })
export class EncorderService extends ApiBase 
{
    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
    }

    public async Get(clientId : number) : Promise<GetEncoderResponse>
    {
      var response = await this._http.get(API_URL + 'api/Encoders/Get?clientId=' + clientId)
      .toPromise()
      .then(x=> x as GetEncoderResponse)
  
      this.ProcessResponse(response);
  
      return response;
    }

    public async Create(request : CreateEncoderRequest) : Promise<CreateEncoderResponse>
    {

      var requestPayLoad : string = JSON.stringify(request);
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      var response = await this._http.post(API_URL + 'api/Encoders/Create', requestPayLoad, {headers : headers})
      .toPromise()
      .then(x=> x as CreateEncoderResponse)
  
      this.ProcessResponse(response);
  
      return response;
    }
}
