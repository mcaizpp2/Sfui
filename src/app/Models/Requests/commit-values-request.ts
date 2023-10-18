import { ValueTypeEnum } from "../Enums/value-type-enum";

export class CommitValuesRequest {

    ValueType : ValueTypeEnum;
    ValueId : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
