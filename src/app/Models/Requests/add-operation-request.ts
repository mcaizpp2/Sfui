import { OperationParam } from "../Dtos/Cleansing/operation-param";

export class AddOperationRequest {

    OperationTypeId : number;
    OperationsParam : OperationParam;
    CleansedMgrId : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
