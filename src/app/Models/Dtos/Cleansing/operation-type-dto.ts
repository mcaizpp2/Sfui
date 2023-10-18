import { OpTypeDto } from "./op-type-dto";

export class OperationTypeDto {

    operationTypeId : number;

    name : string;

    enabled : boolean;

    opType : OpTypeDto;

    visible : boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }

}
