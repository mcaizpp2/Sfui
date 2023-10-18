import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class CreateEncoderResponse extends BaseResponse implements IResponse {

    encoderId: number;
}
