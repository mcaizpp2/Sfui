import { FieldDto } from "./field-dto";

export class FieldLogicErrorDto {

    field : FieldDto;

    message : string;

    value : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
