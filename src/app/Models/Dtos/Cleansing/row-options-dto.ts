import { OperationTypeDto } from "./operation-type-dto";

export class RowOptionsDto {
    componentId : number;

    include : boolean; 

    rowIdx : number;
    
    compIdx : number;

    workSheet : string;

    workSheetId : number;

    removeRow : OperationTypeDto;

    setHeader : OperationTypeDto;

    addHeader : OperationTypeDto;
}
