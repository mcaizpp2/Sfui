import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { ColMapDto } from "../Dtos/col-map-dto";
import { HeaderDto } from "../Dtos/header-dto";
import { MapHeaderDto} from "../Dtos/map-header-dto";

export class ColumnMapResponse extends BaseResponse implements IResponse 
{
     columnMappings : ColMapDto[];
     suggestions : ColMapDto[];
     headers : HeaderDto[];
     mapHeaders : MapHeaderDto[];
     sampleData : string[][];
     suggestionsNew : MapHeaderDto[];
}
