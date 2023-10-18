import { OperationTypeDto } from "./operation-type-dto";

export class ComponentOptionsDto 
{
    //name : string;

    include : boolean; 
    
    compIdx : number;

    workSheet : string;

    workSheetId : number;

    addOrigin : OperationTypeDto;

    remove : OperationTypeDto;

    join : OperationTypeDto;

    union : OperationTypeDto;

    addHeader : OperationTypeDto;

    constructor(values: Object = {}) 
    {
        Object.assign(this, values);
    }

}
