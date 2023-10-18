import { MappingValDto } from "../Dtos/mapping-val-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class GetConversionValidationsResponse extends BaseResponse implements IResponse {
    validations : MappingValDto[];
}
