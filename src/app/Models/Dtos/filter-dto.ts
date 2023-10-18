export class FilterDto {
    set : boolean;
    text : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
