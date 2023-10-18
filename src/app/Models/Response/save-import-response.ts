import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class SaveConversionResponse extends BaseResponse implements IResponse  {
    conversionId : number;
}
