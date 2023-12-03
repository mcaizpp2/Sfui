import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { SprinklerValsDto } from "../Models/Dtos/sprinkler-dto";
import { CommitValuesRequest } from "../Models/Requests/commit-values-request";
import { DeleteValuesRequest } from "../Models/Requests/delete-values-request";
import { UpdateSprinklerRequest } from "../Models/Requests/update-sprinkler-request";
import { UpdateValueRequest } from "../Models/Requests/update-value-request";
import { AdminValuesResponse } from "../Models/Response/admin-values-response";
import { CommitResponse } from "../Models/Response/commit-response";
import { DeleteSprinklerResponse } from "../Models/Response/delete-sprinkler-response";
import { DeleteValuesResponse } from "../Models/Response/delete-values-response";
import { UpdateValueResponse } from "../Models/Response/update-value-response";
import { MediatorService } from "../Services/mediator.service";
import { ApiBase } from "./api-base";
import { Observable } from "rxjs";

const API_URL = environment.apiUrl;
@Injectable({
    providedIn: 'root'
  })
export class AdminValuesService extends ApiBase {

 
    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
      }

      public async Get() : Promise<AdminValuesResponse>
      {
        var response = await this._http.get(API_URL + 'api/Values/Get')
        .toPromise()
        .then(x=> x as AdminValuesResponse)
    
        this.ProcessResponse(response);
        return response;
      }

      public async DeleteSprinkler(sprinkler : SprinklerValsDto) : Promise<DeleteSprinklerResponse>
      {
        var response = await this._http.delete(API_URL + 'api/Values/DeleteSprinkler/' + sprinkler.sprinklerValsId)
        .toPromise()
        .then(x=> x as DeleteSprinklerResponse)
    
        this.ProcessResponse(response);
        return response;
      }

      public async CommitSprinkler(sprinkler : SprinklerValsDto) : Promise<CommitResponse>
      {
        var response = await this._http.get(API_URL + 'api/Values/CommitSprinkler/' + sprinkler.sprinklerValsId)
        .toPromise()
        .then(x=> x as CommitResponse)
    
        this.ProcessResponse(response);
        return response;
      }

      public async CommitValue(request : CommitValuesRequest) : Promise<CommitResponse>
      {
        var requestPayLoad : string = JSON.stringify(request);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/Values/CommitValue', requestPayLoad,{headers : headers})
        .toPromise()
        .then(x=> x as CommitResponse)
    
        this.ProcessResponse(response);
        return response;
      }

      public async DeleteValue(request : DeleteValuesRequest) : Promise<DeleteValuesResponse>
      {
        var requestPayLoad : string = JSON.stringify(request);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = 
        await this._http.post(API_URL + 'api/Values/DeleteValue', requestPayLoad, {headers : headers})
        .toPromise()
        .then(x=> x as DeleteValuesResponse)
        this.ProcessResponse(response);
        return response;
      }

      public async UpdateSprinklerValue(request : UpdateSprinklerRequest) : Promise<UpdateValueResponse>
      {
        var requestPayLoad: string = JSON.stringify(request);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        //var response = await firstValueFrom(this._http.put(API_URL + 'api/Values/UpdateSprinklerValues', requestPayLoad, { headers: headers }))
        //  .then(x => x as UpdateValueResponse)

        var response = await this._http.put(API_URL + 'api/Values/UpdateSprinklerValues', requestPayLoad, { headers: headers })
        .toPromise()
        .then(x=> x as UpdateValueResponse)
    
        this.ProcessResponse(response);
        return response;
      }

      public async UpdateValue(request : UpdateValueRequest) : Promise<UpdateValueResponse>
      {
        var requestPayLoad : string = JSON.stringify(request);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/Values/UpdateValue', requestPayLoad, {headers : headers})
        .toPromise()
        .then(x=> x as UpdateValueResponse);
    
        this.ProcessResponse(response);
        return response;
      }
}

