import { FieldTypes } from "../Enums/field-types";
import { MatchedEnum } from "../Enums/MatchedEnum";

export class TestTerm {
    testTermsId : number;
    loadTypeId : FieldTypes;
    terms : string;
    answer : string;
    answerId : number;
    matched : MatchedEnum;
    isAddedTerm : boolean;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
