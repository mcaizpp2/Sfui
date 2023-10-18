import { environment } from "../../environments/environment";
import { ApiBase } from "./api-base";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MediatorService } from "../Services/mediator.service";
import { ToastrService } from "ngx-toastr";
import { GetKeyWordsResponse } from "../Models/Response/get-key-words-response";
import { Injectable } from "@angular/core";
import { StageResponse} from "../Models/Response/stage-response";
import { GetTestTermsResponse } from "../Models/Response/get-test-terms-response";
import { StageRequest } from "../Models/Requests/stage-request";
import { CommitRequest } from "../Models/Requests/commit-request";
import { CommitResponse } from "../Models/Response/commit-response";
import { DeleteLoadValResponse } from "../Models/Response/delete-load-val-response";

const API_URL = environment.apiUrl;
@Injectable({
    providedIn: 'root'
  })
export class MaintenanceService extends ApiBase{

    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
    }

    public async Get() : Promise<GetKeyWordsResponse>
    {
      var response = await this._http.get(API_URL + 'api/Maintenance/Get')
      .toPromise()
      .then(x=> x as GetKeyWordsResponse)
  
      this.ProcessResponse(response);
  
      return response;
    }

    public async GetTestTerms(userId : number) : Promise<GetTestTermsResponse>
    {
      var response = await this._http.get(API_URL + 'api/Maintenance/GetTestTerms?userId=' + userId)
      .toPromise()
      .then(x=> x as GetTestTermsResponse)
  
      this.ProcessResponse(response);
  
      return response;
    }

    public async Commit(commitRequest : CommitRequest) : Promise<CommitResponse>
    {
      let formData: FormData = new FormData();
      var requestPayLoad : string = JSON.stringify(commitRequest);
      
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      var response = await this._http.post(API_URL + 'api/Maintenance/Commit', requestPayLoad,{headers : headers})
      .toPromise()
      .then(x=> x as CommitResponse)

      this.ProcessResponse(response);

      return response
    }

    public async Stage(stageRequest : StageRequest) : Promise<StageResponse>
    {
      var requestPayLoad : string = JSON.stringify(stageRequest);

      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      var response = await this._http.post(API_URL + 'api/Maintenance/Stage', requestPayLoad,{headers : headers})
      .toPromise()
      .then(x=> x as StageResponse)

      this.ProcessResponse(response);

      return response;
    }

    public async DeleteloadVal(loadValId : number) : Promise<DeleteLoadValResponse>
    {
      var response = await this._http.delete(API_URL + 'api/Maintenance/Delete/' + loadValId )
      .toPromise()
      .then(x=> x as DeleteLoadValResponse);

      this.ProcessResponse(response);
      
      return response;
    }
}
