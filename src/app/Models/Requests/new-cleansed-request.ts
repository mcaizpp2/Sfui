import { Status } from '../Enums/status.enum';

export class NewCleansedRequest {

    Status    : Status;
    Name     :  string;
    UserId     : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
