import { IResponse } from './iresponse';

export class BaseResponse implements IResponse {
    public status : boolean;
    public message : string;
    public title : string;
    public showMsg : boolean;
    public reconciled : boolean;

    constructor(){}
}

export class MessageResponse extends BaseResponse
{
    public messages : string[];

    constructor(){
        super();
    }
}
