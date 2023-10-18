import { RowTypeDto } from "./row-type-dto";
import { ColumnOptionsDto } from "./column-dtos";
import { ComponentOptionsDto} from './component-options-dto';

export class ComponentsDto {
    
    name : string;

    rows : RowTypeDto[];

    cellCount : number;

    remove : boolean;

    componentCtr : number;

    processed : boolean;

    columnOptions : ColumnOptionsDto[];

    componentOptions : ComponentOptionsDto; 

    isOrigin : boolean;

    componentId : number;

    constructor(values: Object = {}) {}
}
