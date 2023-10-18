import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ManagerRequest } from '../Models/Requests/manager-request';
import { ManagerResponse } from '../Models/Response/manager-response';
import {UploadResponse} from '../Models/Response/upload-response';
import { ApiBase } from './api-base';
import { MediatorService } from '../Services/mediator.service';
import { ToastrService } from 'ngx-toastr';
import { ConversionDto } from '../Models/Dtos/conversion-dto';
import { SaveConversionResponse } from '../Models/Response/save-import-response';
import { SummaryResponse } from '../Models/Response/summary-response';
import { DeleteLocationsResponse } from '../Models/Response/delete-locations-response';

const API_URL = environment.apiUrl;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Injectable({
  providedIn: 'root'
})
export class ManagerService extends ApiBase {

  toast : ToastrService; 
  constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
    super(_mediatorService, _toastr);
    this.toast = _toastr;
  }

  public async Get(managerRequest : ManagerRequest): Promise<ManagerResponse> 
  {
    //if (managerRequest.Account == undefined) {
    //  managerRequest.Account = "";
    //}
    var requestPayLoad: string = JSON.stringify(managerRequest);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

 
     var response = await this._http.post(API_URL + 'api/Manager/Get', requestPayLoad, { headers : headers})
    .toPromise()
    .then(x=> x as ManagerResponse)

    this.ProcessResponse(response);

    return response;
  }

public async Download(conversionDto : ConversionDto): Promise<void> 
{
  
  const blob = await this.downloadResource(conversionDto);
 
  const url = window.URL.createObjectURL(blob);
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
         return;
  }
  let a = document.createElement('a');
  a.href = url;
  a.download = conversionDto.name + ".zip";
  document.body.appendChild(a);
  a.click();        
  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
   
}


  public async downloadResource(conversion : ConversionDto): Promise<Blob> {

    var requestPayLoad : string = JSON.stringify(conversion);
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      var uri = API_URL + 'api/Manager/Download';

      const file =  await this._http.post<Blob>(uri,requestPayLoad,
      {headers : headers, responseType: 'blob' as 'json'}).toPromise();

    return file;
  }


  public async DeleteLocations(convId : number)
  {
    var response = await this._http.get(API_URL + 'api/Conversion/DeleteLocations?conversionId=' + convId.toString())
    .toPromise()
    .then(x=> x as DeleteLocationsResponse)

    this.ProcessResponse(response);

    return response;
  }

  public async UploadFile(file : File, workSheet : string, name : string)
  {
    let formData: FormData = new FormData();
  
    formData.append(file.name, new Blob([file], {type: EXCEL_TYPE}));
    formData.append('workSheet', workSheet);
    formData.append('name', name);

    var response = await this._http.post(API_URL + 'api/Files/Upload', formData)
    .toPromise()
    .then(x=> x as UploadResponse)

    this.ProcessResponse(response);

    return response;
  }

  public async SaveImport(conversion : ConversionDto) : Promise<SaveConversionResponse>
  {

    var conversionPayLoad : string = JSON.stringify(conversion);
    let formData: FormData = new FormData();
    formData.append('conversion', conversionPayLoad);

    var response = await this._http.post(API_URL + 'api/Manager/SaveImport', formData)
    .toPromise()
    .then(x=> x as SaveConversionResponse)

    this.ProcessResponse(response);

    return response;
  }

  public async GetSummary(convId : number) : Promise<SummaryResponse>
  {
    
    var response = await this._http.get(API_URL + 'api/Conversion/GetSummary?convId=' + convId.toString())
    .toPromise()
    .then(x=> x as SummaryResponse)

    this.ProcessResponse(response);

    return response;
  }
}
