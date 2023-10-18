import { MessageResponse } from "./response";
import { IResponse } from "./iresponse";

export class SaveUserResponse extends MessageResponse implements IResponse { 
    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
