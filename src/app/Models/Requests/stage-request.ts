import { FieldTypes } from "../Enums/field-types";
import { TestTerm } from "../Dtos/test-term";
import { LoadValsDto } from "../Dtos/load-vals-dto";

export class StageRequest {

    FieldType : FieldTypes;
    Terms   : TestTerm[];
    Load : LoadValsDto;
    UserId : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
