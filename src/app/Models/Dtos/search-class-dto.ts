export class ValMappedDto {

    Name : string;
    Code : string;
    Scheme : string;
    id : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
