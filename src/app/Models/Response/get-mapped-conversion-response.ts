import { AssumptionsDto } from "../Dtos/assumptions-dto";
import { ConfidenceDto } from "../Dtos/confidence-dto";
import { OccupancyTypeDto } from "../Dtos/occupancy-type-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class GetMappedConversionResponse extends BaseResponse implements IResponse {

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
