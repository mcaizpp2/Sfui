import { HttpClient } from "@angular/common/http";
import { MediatorService } from "../Services/mediator.service";
import { ToastrService } from "ngx-toastr";
import { ApiBase } from "./api-base";
import { Injectable } from "@angular/core";
import { ColumnMapResponse} from '../Models/Response/column-map-response';
import { environment } from "../../environments/environment";
import { SaveConversionMappingsRequest } from "../Models/Requests/save-conversion-mappings-request";
import { AddColRequest } from "../Models/Requests/add-col-requests";
import { AddColResponse } from "../Models/Response/add-col-response";
import { SaveConversionMappingsResponse } from "../Models/Response/save-conversion-mappings-response";
import {GetConversionValidationsResponse} from '../Models/Response/get-conversion-validations-response';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
  })
export class MappingService extends ApiBase {
  constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) 
  {
    super(_mediatorService, _toastr);
  }

  public async Get(convId : number): Promise<ColumnMapResponse> 
  {
    var response = await this._http.get(API_URL + 'api/ColMap/Map?convId=' + convId)
    .toPromise()
    .then(x=> x as ColumnMapResponse)

    this.ProcessResponse(response);

    return response;
  }
  
  public async AddColumn(addColRequest : AddColRequest) : Promise<AddColResponse>
  {
    var requestPayLoad : string = JSON.stringify(addColRequest);
    let formData: FormData = new FormData();
    formData.append('request', requestPayLoad);

    var response = await this._http.post(API_URL + 'api/ColMap/AddCol', formData)
    .toPromise()
    .then(x=> x as AddColResponse)

    this.ProcessResponse(response);

    return response;

  }

  public async SaveMappings(request : SaveConversionMappingsRequest) : Promise<SaveConversionMappingsResponse>
  {
    var requestPayLoad : string = JSON.stringify(request);
    let formData: FormData = new FormData();
    formData.append('request', requestPayLoad);

 
    var response = await this._http.post(API_URL + 'api/ColMap/Save', formData)
    .toPromise()
    .then(x=> x as SaveConversionMappingsResponse)

    this.ProcessResponse(response);

    return response;
  }

  public async GetValidations() : Promise<GetConversionValidationsResponse>
  {
    var response = await this._http.get(API_URL + "api/ColMap/GetValidations")
    .toPromise()
    .then(x=> x as GetConversionValidationsResponse)

    this.ProcessResponse(response);

    return response;
  }
}
