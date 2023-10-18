import { ValueTypeEnum } from "../Enums/value-type-enum";

export class UpdateValueRequest {
    ValueType : ValueTypeEnum;
    Value : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
