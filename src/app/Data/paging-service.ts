import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";
import { MediatorService } from "../Services/mediator.service";
import { ApiBase } from "./api-base";
import { PagingRequest } from "../Models/Requests/paging-request";
import { PagingResponse } from "../Models/Response/paging-response";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
  })
export class PagingService extends ApiBase {

    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) 
    {
      super(_mediatorService, _toastr);
    }

    public async Page(pagingRequest : PagingRequest): Promise<PagingResponse> 
    {
        var requestPayLoad : string = JSON.stringify(pagingRequest);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');
        var response = await this._http.post(API_URL + 'api/Paging/Page', requestPayLoad, { headers: headers })
        .toPromise()
        .then(x=> x as PagingResponse)
        this.ProcessResponse(response);

        return response;
    }
}
