export class OperationValidationDto 
{
    rowIdx : number;
    message : string;
    type : number; 
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
