import {CompareResultsDto} from '../Dtos/compare-results-dto';
import { BaseResponse } from './response';
import { IResponse } from './iresponse';

export class CompareResponse extends BaseResponse implements IResponse {
    public compareResults: CompareResultsDto[];
    public totalBldgMatched : number;
    public totalBldgNotMatched : number;
    public totalOccupancyMatched : number;
    public totalOccupancyNotMatched : number;
}
