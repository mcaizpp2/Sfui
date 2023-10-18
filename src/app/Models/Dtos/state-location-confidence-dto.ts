export class StateLocationConfidenceDto {

    state : string;

    sumOccRating : number;

    sumBldgRating : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
