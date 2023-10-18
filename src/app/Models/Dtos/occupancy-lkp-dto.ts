export class OccupancyLkpDto {

    id : number;

    scheme : string;

    code : number;

    name : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}