import { FieldTypes } from "../Enums/field-types";
import { LoadValsDto } from "../Dtos/load-vals-dto";
import { TestTerm } from "../Dtos/test-term";

export class CommitRequest {
    FieldType : FieldTypes;
    Load : LoadValsDto;
    UserId : number;
    TestTerms : TestTerm[];
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
