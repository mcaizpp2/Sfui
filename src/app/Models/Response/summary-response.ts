import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { SummaryDto } from "../Dtos/summary-dto";

export class SummaryResponse extends BaseResponse implements IResponse {

    summary : SummaryDto;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
