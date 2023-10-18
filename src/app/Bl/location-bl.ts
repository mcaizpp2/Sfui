import { Injectable } from "@angular/core";
import { LocationService } from "../Data/location-service";
import { LocationsMappedResponse } from "../models/Response/locations-mapped-response";
import { Observable } from "rxjs";
import { LocationUpdatesResponse } from "../Models/Response/location-updates-response";
import { LocationDto } from "../Models/Dtos/location-dto";
import { ExportResponse } from "../models/Response/export-response";
import { FieldTypes } from "../Models/Enums/field-types";
import { LocUpdatesDto } from "../Models/Dtos/loc-updates-dto";
import { LocUpdatesRequest } from "../Models/Requests/loc-updates-request";
import { SummaryDto } from '../Models/Dtos/summary-dto';
import { ProgressResponse } from "../Models/Response/progress-response";
import { GetMappedConversionResponse } from "../Models/Response/get-mapped-conversion-response";

@Injectable({
    providedIn: 'root'
  })
export class LocationBl {

    constructor(private _locationService : LocationService) {}

    public async GetMapped(convId : number) : Promise<GetMappedConversionResponse>
    {
      var response = await this._locationService.GetMappedConversion(convId);

      return response;
    }

    public async MapLocations(convId : number) : Promise<LocationsMappedResponse>
    {
        var response = await this._locationService.MapLocations(convId);

        return response;
    }

    public Get(convId : number, numberOfRecords : number) : Observable<LocationDto[][]>
    {
      return this._locationService.retrieveMultiple(convId, numberOfRecords);
    }

    public async Get2(convId : number, numberOfRecords : number)
    {
      return await this._locationService.RetrieveMultiple2(convId, numberOfRecords);
    }

    public Export(convId : number) : Promise<ExportResponse>
    {
        return this._locationService.Export(convId);
    }

    public GetProgress(conversionId : number, parseType : number) : Observable<ProgressResponse>
    {
      return this._locationService.GetProgress(conversionId, parseType);
    }



    public async UpdateLocations(convId : number, locations : LocationDto[],  value : string,  fieldType : FieldTypes, addToLoadVals : boolean = false,summaryDto : SummaryDto) : Promise<LocationUpdatesResponse>
    {
      var lst : LocUpdatesDto[] = [];
      locations.forEach(x=>
      {
        lst.push(new LocUpdatesDto({ LocationId : x.locId, Value: value, 
          FieldId : fieldType, AddToLoadVals : addToLoadVals,
        SegmentId : x.segmentId }));
      });

       let locUpdatesRequest = new LocUpdatesRequest({ ConvId : convId, LocationUpdates : lst, SummaryDto : summaryDto });
        locUpdatesRequest.ConvId = convId;
        locUpdatesRequest.LocationUpdates = lst;

       return await this._locationService.LocationUpdates(locUpdatesRequest);
    }

    public async DeleteProgress(convId : number, parseType : number)
    {
      await this._locationService.DeleteProgress(convId, parseType);
    }
}
