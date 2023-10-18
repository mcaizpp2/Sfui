import { ComponentLkpDto, LookupDto } from '../str-lookup-dto';
import { OperationTypeDto } from './operation-type-dto';

export class MapLkpDto {

    Component : string;
    ComponentId : number;
    CompNames : ComponentLkpDto[] = [];
    ModalHeader : string;
    JoinCompName : string;
    JoinCompId : number;
    ColumnToMap : string;
    CompOneColName  :string;
    CompOneColIdx : number;
    CompOneFieldId : number;
    CompTwoNames : LookupDto[];
    CompTwoIdx : number;
    CompTwoWsIdx : number;
    ValueColumn : number;
    MapColumn : number;
    OperationType : OperationTypeDto;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
