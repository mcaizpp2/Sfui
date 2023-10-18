import { SprinklerDto, SprinklerValsDto } from "../Dtos/sprinkler-dto";
import { ValDto } from "../Dtos/state-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class AdminValuesResponse extends BaseResponse implements IResponse {

    public sprinklerValues : SprinklerValsDto[];

    public streetValues : ValDto[];

    public stateValues : ValDto[];
}
