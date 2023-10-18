import { UserDto } from "../Dtos/user-dto";

export class CleanseExportRequest {

    public User : UserDto;
    public CleanseMgrId : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
