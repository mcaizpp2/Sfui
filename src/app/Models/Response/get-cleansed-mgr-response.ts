import { CleansedMgrDto } from "../Dtos/cleansed-mgr-dto";
import { IResponse } from './iresponse';
import { BaseResponse } from './response';

export class GetCleansedMgrResponse extends BaseResponse implements IResponse 
{
    cleansedMgrs : CleansedMgrDto[]
    recordCtr : number;
}
