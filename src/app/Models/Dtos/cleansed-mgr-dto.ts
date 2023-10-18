import { UserDto } from './user-dto';

export class CleansedMgrDto {
        cleansedMgrId : number;
        name : string;
        filePath : string;
        created : Date;
        user : UserDto;
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
