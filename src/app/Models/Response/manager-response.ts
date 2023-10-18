import { ConversionDto } from '../Dtos/conversion-dto';
import { IResponse } from './iresponse';
import { PagingResponse } from './paging-response';

export class ManagerResponse extends PagingResponse implements IResponse
{
    conversions : ConversionDto[];
    totalRows : number;
    
}
