import { StateLocationConfidenceDto } from './state-location-confidence-dto';

export class LocationConfidenceDto {
    country : string;

    stateLocationConfidenceDtos : StateLocationConfidenceDto;

    sumOccRating : number;

    sumBldgRating : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
