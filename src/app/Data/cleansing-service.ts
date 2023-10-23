import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../environments/environment";
import { CleanLoadRequest } from "../Models/Requests/cleanse-request";
import { CleanLoadResponse} from "../Models/Response/cleanse-response";
import { MediatorService } from "../Services/mediator.service";
import { ApiBase } from "./api-base";
import { GetCleansedMgrRequest } from "../Models/Requests/get-cleansed-mgr-request";
import { GetCleansedMgrResponse } from "../Models/Response/get-cleansed-mgr-response";
import { NewCleansedRequest } from "../Models/Requests/new-cleansed-request";
import { NewCleansedResponse } from "../Models/Response/new-cleansed-response";
import { AddOperationResponse } from "../Models/Response/add-operation-response";
import { AddOperationRequest } from "../Models/Requests/add-operation-request";
import { OperationsResponse } from "../Models/Response/operations-response";
import { DeleteOperationResponse } from "../Models/Response/delete-operation-response";
import { CleanseExportResponse } from "../Models/Response/cleanse-export-response";
import { CleanseExportRequest } from "../Models/Requests/cleanse-export-request";
import { ReplayRequest } from "../Models/Requests/replay-request";
import { ReplayResponse } from "../Models/Response/replay-response";

const API_URL = environment.apiUrl;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Injectable({
    providedIn: 'root'
  })
export class CleansingService extends ApiBase {

    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
      }

      public async Replay(replayRequest : ReplayRequest, file : File) : Promise<ReplayResponse>
      {
        var requestPayLoad : string = JSON.stringify(replayRequest);
        let formData: FormData = new FormData();
        formData.append('request', requestPayLoad);

        formData.append(file.name, new Blob([file], {type: EXCEL_TYPE}));
        formData.append('name', file.name);

        var response = await this._http.post(API_URL + 'api/Cleanse/Replay', formData)
        .toPromise()
        .then(x=> x as ReplayResponse)

        this.ProcessResponse(response);
    
        return response;
      }

      public async New(newCleansedRequest : NewCleansedRequest, file : File) : Promise<NewCleansedResponse>
      {
        var requestPayLoad : string = JSON.stringify(newCleansedRequest);
        let formData: FormData = new FormData();
        formData.append('request', requestPayLoad);

        formData.append(file.name, new Blob([file], {type: EXCEL_TYPE}));
        formData.append('name', file.name);

        var response = await this._http.post(API_URL + 'api/Cleanse/New', formData)
        .toPromise()
        .then(x=> x as NewCleansedResponse)
  
        this.ProcessResponse(response);
    
        return response;
      }

      public async Load(cleanLoadRequest : CleanLoadRequest) : Promise<CleanLoadResponse>
      {
        var requestPayLoad : string = JSON.stringify(cleanLoadRequest);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/Cleanse/Load', requestPayLoad, { headers: headers })
        .toPromise()
        .then(x=> x as CleanLoadResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public async LoadOperations(cleanseMgrId : number) : Promise<OperationsResponse>
      {
        var response = await this._http.get(API_URL + 'api/Cleanse/Operations?cleanseMgrId=' + cleanseMgrId)
        .toPromise()
        .then(x=> x as OperationsResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public async DeleteOperation(operationId : number) : Promise<DeleteOperationResponse>
      {
        var response = await this._http.get(API_URL + 'api/Cleanse/DeleteOp?operationsId=' + operationId)
        .toPromise()
        .then(x=> x as DeleteOperationResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public async AddOperation(addOperationRequest : AddOperationRequest) : Promise<AddOperationResponse>
      {
        var requestPayLoad : string = JSON.stringify(addOperationRequest);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/Cleanse/AddOperation', requestPayLoad, { headers: headers })
        .toPromise()
        .then(x=> x as AddOperationResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public async Get(request : GetCleansedMgrRequest) : Promise<GetCleansedMgrResponse>
      {
        var requestPayLoad : string = JSON.stringify(request);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/Cleanse/Get', requestPayLoad, { headers: headers })
        .toPromise()
        .then(x=> x as GetCleansedMgrResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public async Export(cleanseExportRequest : CleanseExportRequest) : Promise<CleanseExportResponse>
      {
        var requestPayLoad : string = JSON.stringify(cleanseExportRequest);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/Cleanse/Export', requestPayLoad, { headers: headers })
        .toPromise()
        .then(x=> x as CleanseExportResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }
    }
