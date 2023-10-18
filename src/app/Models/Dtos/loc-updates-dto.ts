export class LocUpdatesDto {
    LocationId : number;

    Value : string;

    FieldId : number;

    AddToLoadVals : boolean;

    SegmentId : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
