import {CleanedWsDto} from '../Dtos/Cleansing/cleanedWs-dto';
import { IResponse } from './iresponse';
import { BaseResponse } from './response';
import { OperationValidationDto} from '../Dtos/Cleansing/operation-validation-dto';

export class CleanLoadResponse extends BaseResponse implements IResponse {
    cleanedDtos : CleanedWsDto[];
    processed : CleanedWsDto;
    validations : OperationValidationDto[];
    constructor(values: Object = {}) 
    {
        super();
        Object.assign(this, values);
    }
}
