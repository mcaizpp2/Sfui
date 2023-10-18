import { OperationTypeDto } from "./operation-type-dto";

export class ColumnOptionsDto {
    // name : string;

    include : boolean; 

    remove : OperationTypeDto;

    split : OperationTypeDto;

    map : OperationTypeDto;

    colIdx : number;

    workSheet : string;

    workSheetId : number;

    componentId : number;
    
    component : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
