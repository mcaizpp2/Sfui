import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";
import { LocationDto } from '../Dtos/location-dto';
import { OccupancyTypeDto } from "../Dtos/occupancy-type-dto";
import { DistinctInputs} from "../Dtos/distinct-inputs";

export class MapRowsResponse extends BaseResponse implements IResponse {
    locations : LocationDto[];
    commonOccupancy : OccupancyTypeDto;
    hasCountry : boolean;
    defaultCountry : string;
    distinctInputs : DistinctInputs;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
