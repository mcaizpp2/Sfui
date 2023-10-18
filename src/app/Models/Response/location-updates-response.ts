import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { LocationDto } from "../Dtos/location-dto";
import { SummaryDto } from '../Dtos/summary-dto';

export class LocationUpdatesResponse extends BaseResponse implements IResponse {

    locationsUpdated : number;
    locations : LocationDto[];
    summary : SummaryDto;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
