import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class NewCleansedResponse extends BaseResponse implements IResponse {
    cleansedMgrId : number;

    constructor(values: Object = {}) 
    {
        super();
        Object.assign(this, values);
    }

}
