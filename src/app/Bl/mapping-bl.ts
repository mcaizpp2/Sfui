import { MappingService } from "../Data/mapping-service";
import { Injectable } from "@angular/core";
import { ColumnMapResponse } from "../Models/Response/column-map-response";
import { ColMapDto } from "../Models/Dtos/col-map-dto";
import { ConversionDto } from "../Models/Dtos/conversion-dto";
import {SaveConversionMappingsRequest} from "../Models/Requests/save-conversion-mappings-request";
import { SaveConversionMappingsResponse } from "../Models/Response/save-conversion-mappings-response";
import { GetConversionValidationsResponse } from "../Models/Response/get-conversion-validations-response";
import { AddColRequest } from "../Models/Requests/add-col-requests";
import { AddColResponse } from "../Models/Response/add-col-response";
import { MapHeaderDto } from "../Models/Dtos/map-header-dto";

@Injectable({
    providedIn: 'root'
  })
export class MappingBl {

    constructor(private _mappingService :MappingService) {}

    public async Map(convId : number) : Promise<ColumnMapResponse>
    {
        var response = await this._mappingService.Get(convId);

        return response;
    }

    public async SaveMapping(mapHeaders : MapHeaderDto[], conversionDto : ConversionDto) : Promise<SaveConversionMappingsResponse>
    {
        var mapped = mapHeaders.filter(x=> x.selected.fieldId > 0);
        var request = new SaveConversionMappingsRequest
        (
            {
                Mapped : mapped,
                ConversionDto : conversionDto 
            }
        );
        
        return await this._mappingService.SaveMappings(request);
    }

    public async GetValidations() : Promise<GetConversionValidationsResponse>
    {
        return await this._mappingService.GetValidations();
    }

    public async AddColumn(addColRequest: AddColRequest) : Promise<AddColResponse>
    {
        return await this._mappingService.AddColumn(addColRequest);
    }
}
