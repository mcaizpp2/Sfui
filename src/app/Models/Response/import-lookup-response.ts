import { CurrencyDto } from "../Dtos/currency-dto";
import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";

export class ImportLookupResponse extends BaseResponse implements IResponse {

    currencies : CurrencyDto[];
}
