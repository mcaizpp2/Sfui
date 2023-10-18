
export class ManagerRequest {

  
    Account    : string;
    Status     : number[];
    UserId     : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
