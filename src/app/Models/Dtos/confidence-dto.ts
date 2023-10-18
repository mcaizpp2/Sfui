import { LocationTivDto} from './location-tiv-dto';
import { LocationConfidenceDto} from './location-confidence-dto';

export class ConfidenceDto {

    locationTivDtos : LocationTivDto[];

    locationConfidenceDtos : LocationConfidenceDto[];

    totalTiv : number;

    bldgTiv : number;

    occTiv : number;

    sumOccRating : number;

    sumBldgRating : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
