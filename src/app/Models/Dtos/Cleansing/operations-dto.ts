import { OperationTypeDto } from "./operation-type-dto";

export class OperationsDto {

    operationsId : number;

    cleansedMgrId : number;

    operationType : OperationTypeDto;

    workSheet : string;
    workSheetId : number;

    component : string;
    componentId : number;

    sortOrder : number;

    colIdx : number;

    field : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
