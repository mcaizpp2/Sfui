export class LocationStateTivDto {
    state : string;
    totalTiv : number;
    occTiv : number;
    bldgTiv : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
