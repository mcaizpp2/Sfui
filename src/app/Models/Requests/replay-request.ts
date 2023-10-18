export class ReplayRequest {
    UserId : number;
    CleanseMgrId : string;
    CopyFromId : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
