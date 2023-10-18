import { Injectable } from "@angular/core";
import { AdminValuesService } from "../Data/admin-values-service";
import { SprinklerValsDto } from "../Models/Dtos/sprinkler-dto";
import { ValDto } from "../Models/Dtos/state-dto";
import { ValueTypeEnum } from "../Models/Enums/value-type-enum";
import { DeleteValuesRequest } from "../Models/Requests/delete-values-request";
import { UpdateSprinklerRequest } from "../Models/Requests/update-sprinkler-request";
import { UpdateValueRequest } from "../Models/Requests/update-value-request";
import { AdminValuesResponse } from "../Models/Response/admin-values-response";
import { DeleteSprinklerResponse } from "../Models/Response/delete-sprinkler-response";
import { DeleteValuesResponse } from "../Models/Response/delete-values-response";
import { UpdateSprinklerResponse } from "../Models/Response/update-sprinkler-response";
import { UpdateValueResponse } from "../Models/Response/update-value-response";
import { CommitResponse } from "../Models/Response/commit-response";
import { CommitValuesRequest } from "../Models/Requests/commit-values-request";

@Injectable({
    providedIn: 'root'
  })
export class AdminValuesBl {
    constructor(private _adminValueService : AdminValuesService) {
    }
    
    public async Get() : Promise<AdminValuesResponse>
    {
        var response = await this._adminValueService.Get();
        return response;
    }

    public async DeleteSprinkler(sprinklerValsDto : SprinklerValsDto) : Promise<DeleteSprinklerResponse>
    {
        var response = await this._adminValueService.DeleteSprinkler(sprinklerValsDto);
        return response;
    }

    public async CommitSprinkler(sprinklerValsDto : SprinklerValsDto) : Promise<CommitResponse>
    {
        var response = await this._adminValueService.CommitSprinkler(sprinklerValsDto);
        return response;
    }

    public async CommitValue(valueId : number, valueType : ValueTypeEnum) : Promise<CommitResponse>
    {
        var deleteValRequest = new CommitValuesRequest({
            ValueType: valueType,
            ValueId : valueId
        });
        var response = await this._adminValueService.CommitValue(deleteValRequest);
        return response;
    }

    public async DeleteValue(valueId : number, valueType : ValueTypeEnum) : Promise<DeleteValuesResponse>
    {
        var deleteValRequest = new DeleteValuesRequest({
            ValueType: valueType,
            ValueId : valueId
        });
        var response = await this._adminValueService.DeleteValue(deleteValRequest);
        return response;
    }

    public async UpdateValue(value: ValDto, valueType : ValueTypeEnum) : Promise<UpdateValueResponse>
    {
        var updateValRequest = new UpdateValueRequest({
            ValueType: valueType,
            Value : value
        });

        var response = await this._adminValueService.UpdateValue(updateValRequest);
        return response;
    }

    public async UpdateSprinkler(sprinklerValsDto : SprinklerValsDto) : Promise<UpdateSprinklerResponse>
    {
        var updateSprinklerRequest = new UpdateSprinklerRequest
        ({
            SprinklerValue : sprinklerValsDto
        });

        return await this._adminValueService.UpdateSprinklerValue(updateSprinklerRequest);
    }
}
