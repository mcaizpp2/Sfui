import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";
import { ClientDto } from '../Dtos/client-dto';
import { UserTypeDto} from '../Dtos/user-type-dto';

export class UserLookupsResponse extends BaseResponse implements IResponse {
    clients : ClientDto[];
    userTypes : UserTypeDto[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
