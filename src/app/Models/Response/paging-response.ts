import {BaseResponse} from './response'

export class PagingResponse extends BaseResponse
{
    public total : number;

    public first : number;

    public last : number;

    public current : number;

    public totalPages : number;

    public recFirst : number;

    public recLast : number;

    public recsPerPage : number;

    constructor()
    {
        super();
    }
}