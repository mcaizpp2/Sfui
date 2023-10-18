import { FieldDto } from "./field-dto";
import { HeaderDto } from "./header-dto";

export class ColMapDto {
    column : HeaderDto;
    fields : FieldDto[];
    selected : FieldDto;
    displayField : string;
    id : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
