import { FieldDto } from "./field-dto";
import { HeaderDto } from "./header-dto";

export class MapHeaderDto {

    /*sprinklerInput : string

    segmentId : number; */

    header : HeaderDto;

    fields : FieldDto[];

    selected : FieldDto;

    priority : number;

    displayField : string;

    colIdx : number;
    id : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
