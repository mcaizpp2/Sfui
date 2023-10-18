import { IResponse } from "./iresponse";
import { BaseResponse } from "./response";
import { RmsFieldMappingDto } from "../Dtos/rms-field-mapping-dto";

export class SaveConversionMappingsResponse extends BaseResponse implements IResponse {
    rmsFieldMappingsDto : RmsFieldMappingDto[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
