import { ValueTypeEnum } from "../Enums/value-type-enum";

export class DeleteValuesRequest {
    ValueType : ValueTypeEnum;
    ValueId : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
