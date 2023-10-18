import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class ProgressResponse extends BaseResponse implements IResponse {
    completeText : string;

    percentageText : string;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
