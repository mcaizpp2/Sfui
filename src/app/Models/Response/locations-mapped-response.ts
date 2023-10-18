import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { OccupancyTypeDto } from "../Dtos/occupancy-type-dto";
import { AssumptionsDto } from "../Dtos/assumptions-dto";
import { ConfidenceDto } from "../Dtos/confidence-dto";

export class LocationsMappedResponse extends BaseResponse implements IResponse {

    commonOccupancies : OccupancyTypeDto[];
    rowCount : number;
    assumptions : AssumptionsDto[];
    country : string;
    confidence : ConfidenceDto;
    
    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
