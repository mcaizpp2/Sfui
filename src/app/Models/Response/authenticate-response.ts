import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { UserDto } from "../Dtos/user-dto";

export class AuthenticateResponse extends BaseResponse implements IResponse  {
    public user : UserDto;
    public changePwd : boolean;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
