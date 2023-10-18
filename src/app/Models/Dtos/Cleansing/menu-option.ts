import { OperationTypeDto } from "./operation-type-dto";

export class MenuOption {

    ComponentName : string;
    ComponentId : number;

    WorkSheet : string;
    
    WorkSheetId : number;
  

    RowIdx : number;

    Remove : OperationTypeDto;

    Split : OperationTypeDto;

    Map : OperationTypeDto;

    ColIdx : number;
    
    AddOrigin : OperationTypeDto;
    
    RemoveComponent : OperationTypeDto;
    
    Join : OperationTypeDto;

    RemoveRow : OperationTypeDto;

    Union : OperationTypeDto;

    SetHeader : OperationTypeDto; 

    AddHeader : OperationTypeDto;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
