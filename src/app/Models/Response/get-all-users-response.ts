import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import {UserDto} from '../Dtos/user-dto';

export class GetAllUsersResponse extends BaseResponse implements IResponse {

    public users : UserDto[];

 
}
