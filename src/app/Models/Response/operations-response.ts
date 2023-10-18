import { OperationsDto } from "../Dtos/Cleansing/operations-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class OperationsResponse extends BaseResponse implements IResponse {

    operations : OperationsDto[];
}
