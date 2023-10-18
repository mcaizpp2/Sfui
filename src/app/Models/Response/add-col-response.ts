import { MapHeaderDto } from "../Dtos/map-header-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class AddColResponse extends BaseResponse implements IResponse {
    public mapHeaderDtos : MapHeaderDto[];
}
