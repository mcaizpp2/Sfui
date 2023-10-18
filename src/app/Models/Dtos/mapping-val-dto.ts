import { FieldDto } from "./field-dto";
import {Severity} from "../Enums/severity.enum";

export class MappingValDto {

    mappingValId : number;
        
    valText : string;

    field : FieldDto;

    warningType : Severity;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
