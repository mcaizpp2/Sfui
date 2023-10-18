export class GetCleansedMgrRequest {
    RecFirst : number;
    RecLast : number;
    UserId : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
