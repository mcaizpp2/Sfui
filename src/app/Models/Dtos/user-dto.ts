import { ClientDto } from "./client-dto";
import { UserTypeDto } from "./user-type-dto";

export class UserDto {
    name : string;
    userName : string;
    pwd : string;
    authData : string;
    userId : number;
    client : ClientDto;
    userType : UserTypeDto;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class UserInfo{
  UserId : string;
  ConnectionId : string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
