import { LoadValsDto } from "../Dtos/load-vals-dto";
import { FieldTypes } from "../Enums/field-types";

export class TermMiRequest {
    FieldType : FieldTypes;
    Load : LoadValsDto;
    UserId : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
