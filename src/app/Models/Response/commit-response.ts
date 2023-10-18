import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";

export class CommitResponse extends BaseResponse implements IResponse {

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
