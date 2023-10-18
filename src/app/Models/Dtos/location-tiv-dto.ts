import { LocationStateTivDto } from './location-state-tiv-dto'; 

    export class LocationTivDto {

    totalTiv : number;

    bldgTiv : number;

    occTiv : number;

    country : string;

    locationStateTivDtos : LocationStateTivDto[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
