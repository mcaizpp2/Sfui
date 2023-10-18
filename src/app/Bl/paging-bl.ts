import { Injectable } from "@angular/core";
import { PagingService } from "../Data/paging-service";
import { PagingRequest } from "../Models/Requests/paging-request";
import { PagingResponse } from "../Models/Response/paging-response";
import {ManagerRequest} from '../Models/Requests/manager-request';
import { GetCleansedMgrRequest } from "../Models/Requests/get-cleansed-mgr-request";

@Injectable({
    providedIn: 'root'
  })
export class PagingBl {

    constructor(private _pagingService: PagingService) 
    {
    }

    public async PageConversions(pagingRequest : PagingRequest, account : string, status : number[], userId : number) : Promise<PagingResponse>
    {
        var managerRequest = new ManagerRequest({
            Account : account, 
            Status : status, 
            UserId : userId 
        });

        let filter = JSON.stringify(managerRequest);

        pagingRequest.Filters = filter;
        return await this.PageCommon(pagingRequest);
    }

    public async PageCleansed(pagingRequest : PagingRequest, userId : number) : Promise<PagingResponse>
    {
        var cleansedMgrRequest = new GetCleansedMgrRequest({
   
            UserId : userId 
        });

        let filter = JSON.stringify(cleansedMgrRequest);

        pagingRequest.Filters = filter;
        return await this.PageCommon(pagingRequest);
    }

    private async PageCommon(pagingRequest : PagingRequest) : Promise<PagingResponse>
    {
        return await this._pagingService.Page(pagingRequest);
    }
}
