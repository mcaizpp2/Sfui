import { ApiBase } from "./api-base";
import { ToastrService } from "ngx-toastr";
import { HttpClient } from "@angular/common/http";
import { MediatorService } from "../Services/mediator.service";
import { ImportLookupResponse } from "../Models/Response/import-lookup-response";
import {LocationLookupsResponse} from "../Models/Response/location-lookups-response"; 
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { UserLookupsResponse } from "../Models/Response/user-lookups-response";

const API_URL = environment.apiUrl;
@Injectable({
    providedIn: 'root'
  })
export class LookupService extends ApiBase{

    
  constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
    super(_mediatorService, _toastr);
  }

  public async ImportGet(): Promise<ImportLookupResponse> 
  {
     var response = await this._http.get(API_URL + 'api/Lookup/GetImportLookups')
    .toPromise()
    .then(x=> x as ImportLookupResponse)

    this.ProcessResponse(response);

    return response;
  }

  public async GetLocationLookups() : Promise<LocationLookupsResponse>
  {
    var response = await this._http.get(API_URL + 'api/Lookup/GetLocationLookups')
    .toPromise()
    .then(x=> x as LocationLookupsResponse)

    this.ProcessResponse(response);

    return response;
  }

  public async GetUserLookups(userId : number) : Promise<UserLookupsResponse>
  {
    var response = await this._http.get(API_URL + 'api/Lookup/GetUserLookups/' + userId)
    .toPromise()
    .then(x=> x as UserLookupsResponse)

    this.ProcessResponse(response);

    return response;
  }

}
