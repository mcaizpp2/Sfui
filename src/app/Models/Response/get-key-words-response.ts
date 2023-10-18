import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { LoadValsDto } from "../Dtos/load-vals-dto";

export class GetKeyWordsResponse extends BaseResponse implements IResponse {

    loadVals : LoadValsDto[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
