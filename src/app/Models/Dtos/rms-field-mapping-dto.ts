import { FieldDto } from "./field-dto";

export class RmsFieldMappingDto {

    Field : FieldDto;

    XlMapName : string;

    IsCalculated : boolean;

    DefaultValue  : string;

    SortOrder : number;

    Populate : boolean;

    IsAddressPart  : boolean
}
