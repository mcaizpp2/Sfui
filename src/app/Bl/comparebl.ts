import { CompareService } from '../Data/compare-service';
import { FilesResponse } from '../Models/Response/files-response';
import { Injectable } from "@angular/core";
import { GetWorkSheetsRequest } from '../Models/Requests/files-request';
import { GetWorkSheetsResponse } from '../Models/response/get-work-sheets-response';
import { CompareRequest } from '../Models/Requests/compare-request';
import { CompareResponse} from '../Models/Response/compare-response';

@Injectable({
    providedIn: 'root'
  })
export class CompareBl {

    constructor(private _compareService : CompareService) {}

    public async Get() : Promise<FilesResponse>
    {
        var response = await this._compareService.GetFiles();

        return response;
    }

    public async GetWorkSheets(getWorkSheetsRequest : GetWorkSheetsRequest) : Promise<GetWorkSheetsResponse>
    {
        var response = await this._compareService.GetWorkSheets(getWorkSheetsRequest);

        return response;
    }

    public async Compare(compareRequest  :CompareRequest, file : File) : Promise<CompareResponse>
    {
        debugger;
        var response = await this._compareService.Compare(compareRequest, file);

        return response;
    }
}
