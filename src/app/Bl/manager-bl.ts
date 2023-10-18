import { ManagerService } from '../Data/manager.service';
import { ManagerRequest } from '../Models/Requests/manager-request';
import { ManagerResponse } from '../Models/Response/manager-response';
import { Injectable } from '@angular/core';
import { UploadResponse } from '../Models/Response/upload-response';
import {SaveConversionResponse} from '../Models/Response/save-import-response';
import { ConversionDto } from '../Models/Dtos/conversion-dto';
import { SummaryResponse } from '../Models/Response/summary-response';
import { PagingDto } from '../Models/Dtos/paging-dto';

@Injectable({
    providedIn: 'root'
  })
export class ManagerBl {

    constructor(private _managerService : ManagerService) { }

    public async DeleteLocations(convId : number)
    {
        var response = await this._managerService.DeleteLocations(convId);

        return response;
    }

    public async Get(pagingRequest : PagingDto, account : string, status : number[], userId : number) : Promise<ManagerResponse>
    {
        var managerRequest = new ManagerRequest({
            Account : account, 
            Status : status, 
            UserId : userId,
            RecFirst : pagingRequest.RecFirst,
            RecLast : pagingRequest.RecLast
        });

        var response = await this._managerService.Get(managerRequest);

        return response;
    }

    public async UploadFile(file : File, workSheet : string, name : string) : Promise<UploadResponse>
    {
        return await this._managerService.UploadFile(file, workSheet, name);
    }

    public async SaveImport(conversion : ConversionDto) : Promise<SaveConversionResponse>
    {
        return await this._managerService.SaveImport(conversion);
    }

    public Download(conversion: ConversionDto): void
    {
        this._managerService.Download(conversion);
    }

    public async GetSummary(convId : number) : Promise<SummaryResponse>
    {
        return await this._managerService.GetSummary(convId);
    }

   

}
