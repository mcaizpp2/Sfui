export class UserTypeDto {
    userTypeId : number;
    userType : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
