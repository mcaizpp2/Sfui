import { TestTerm } from "../Dtos/test-term";
import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";

export class StageResponse extends BaseResponse implements IResponse{
    terms   : TestTerm[];
    
    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
