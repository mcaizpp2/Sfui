import {StateDto} from './state-dto';

export class AddressDto {
    fullAddress : string;

    streetName : string;

    addressNum : string;

    city : string;

    cityCode : string;

    country : string;

    state : string;

    stateCode : StateDto;

    county : string;

    countyCode : string;

    postalCode : string;

    latitude : string;

    longitude : string;

    addressMatch : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

