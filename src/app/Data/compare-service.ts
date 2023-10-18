import { environment } from "../../environments/environment";
import { ApiBase } from "./api-base";
import { HttpClient } from "@angular/common/http";
import { MediatorService } from "../Services/mediator.service";
import { FilesResponse } from '../Models/Response/files-response';
import { ToastrService } from "ngx-toastr";
import { Injectable } from "@angular/core";
import {GetWorkSheetsRequest} from '../Models/Requests/files-request';
import {GetWorkSheetsResponse} from '../Models/response/get-work-sheets-response'
import { CompareResponse } from "../Models/Response/compare-response";
import { CompareRequest } from "../Models/Requests/compare-request";

const API_URL = environment.apiUrl;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';


@Injectable({
    providedIn: 'root'
  })
export class CompareService extends ApiBase {

    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
      }

      public async GetFiles() : Promise<FilesResponse>
      {
        var response = await this._http.get(API_URL + 'api/Compare/Get')
        .toPromise()
        .then(x=> x as FilesResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public async GetWorkSheets(getWorkSheetsRequest : GetWorkSheetsRequest) : Promise<GetWorkSheetsResponse>
      {
        var requestPayLoad : string = JSON.stringify(getWorkSheetsRequest);
        let formData: FormData = new FormData();
        formData.append('request', requestPayLoad);
        // formData.append(file.name, new Blob([file], {type: EXCEL_TYPE}));
        var response = await this._http.post(API_URL + 'api/Compare/GetWorkSheets', formData)
        .toPromise()
        .then(x=> x as GetWorkSheetsResponse)

        this.ProcessResponse(response);

        return response;
      }

      public async Compare(compareRequest : CompareRequest, droppedFile : File) : Promise<CompareResponse>
      {
        var requestPayLoad : string = JSON.stringify(compareRequest);
        let formData: FormData = new FormData();
        formData.append('request', requestPayLoad);
        formData.append(droppedFile.name, new Blob([droppedFile], {type: EXCEL_TYPE}));

        var response = await this._http.post(API_URL + 'api/Compare/Compare', formData)
        .toPromise()
        .then(x=> x as CompareResponse)

        this.ProcessResponse(response);

        return response;

      }
}
