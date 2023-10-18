import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { ApiBase } from "./api-base";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MediatorService } from "../Services/mediator.service";
import { ToastrService } from "ngx-toastr";
import { LocationsMappedResponse } from '../models/Response/locations-mapped-response';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationDto } from '../Models/Dtos/location-dto';
import { ExportResponse} from '../models/Response/export-response';
import { LocationUpdatesResponse } from "../Models/Response/location-updates-response";
import { LocUpdatesRequest } from "../Models/Requests/loc-updates-request";
import { FilesResponse } from "../Models/Response/files-response";
import { ProgressResponse } from "../Models/Response/progress-response";
import { GetMappedConversionResponse } from "../Models/Response/get-mapped-conversion-response";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
  })
export class LocationService extends ApiBase {

    //observable : [] as  any;
    constructor(private _http: HttpClient, _mediatorService:MediatorService,_toastr: ToastrService) {
        super(_mediatorService, _toastr);
      }

      public async GetMappedConversion(convId : number) : Promise<GetMappedConversionResponse>
      {
 
        var response = await this._http.get(API_URL + "api/Locations/GetMapped?convId=" + convId)
        .toPromise()
        .then(x=> x as GetMappedConversionResponse)
    
        this.ProcessResponse(response);
    
      
        await this.retrieveMultiple(convId, response.rowCount);
        return response;
      }

      public async MapLocations(convId : number) : Promise<LocationsMappedResponse>
      {
        var response = await this._http.get(API_URL + "api/Locations/Map?convId=" + convId)
        .toPromise()
        .then(x=> x as LocationsMappedResponse)
    
        this.ProcessResponse(response);
    
      
        //await this.retrieveMultiple(convId, response.rowCount);
        return response;
      }


      retrieveMultiple(convId : number, locNumCtr : Number) :Observable<any>{

        const result = [] as  any;
   
        for (var i = 0; i < locNumCtr; i+=250)
        {
            var ob = this._http.get(API_URL + "api/Locations/Get?convId="+ convId + "&from=" + i)
            .pipe(map(res => res as LocationDto[]));
            result.push(ob);

        }
        
      
        return forkJoin(result)
          .pipe(map(
                 datas => {
         return datas 
           console.log('received data', datas);
       }));

       }
public async RetrieveMultiple2(convId : number, locNumCtr : Number)
{

  debugger;
   var locations : Array<LocationDto> = [];
 

  for (var i = 0; i < locNumCtr; i+=250)
  {
      var response = await this._http.get(API_URL + "api/Locations/Get?convId="+ convId + "&from=" + i)
      .toPromise()
      .then(x=> x as LocationDto[]);

      response.forEach(x=>
        { locations.push(x);

        });
  }
  return locations;
}
       public async Export(convId : number) : Promise<ExportResponse>
       {
          var response = await this._http.get(API_URL + "api/Locations/Export?convId=" + convId)
          .toPromise()
          .then(x=> x as ExportResponse)
      
          this.ProcessResponse(response);

          return response;
       }

       public async LocationUpdates(locUpdatesRequest : LocUpdatesRequest) : Promise<LocationUpdatesResponse>
       {
        var requestPayLoad : string = JSON.stringify(locUpdatesRequest);
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        var response = await this._http.post(API_URL + 'api/locations/UpdateLocs', requestPayLoad,{headers : headers})
        .toPromise()
        .then(x=> x as LocationUpdatesResponse)
    
        this.ProcessResponse(response);
    
        return response;
       }

       public async DeleteProgress(convId : number, parseType : number) 
       {
        await this._http.get(API_URL + 'api/locations/DeleteProgress?conversionId=' + convId + "&parseType=" + parseType)
        .toPromise()
       }

      public async GetFiles() : Promise<FilesResponse>
      {
        var response = await this._http.get(API_URL + 'api/Compare/Get')
        .toPromise()
        .then(x=> x as FilesResponse)
    
        this.ProcessResponse(response);
    
        return response;
      }

      public GetProgress(conversionId : number, parseType : number) :Observable<ProgressResponse>
      {
        var response = this._http.get(API_URL + "api/Locations/GetProgress?conversionId=" + conversionId + "&parseType=" + parseType)
        .pipe(map(res => res as ProgressResponse))
       
 
        return response;
      }
}
