import { EncoderDto } from "../Dtos/encoder-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class GetEncoderResponse extends BaseResponse implements IResponse{

    encoders : EncoderDto[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
