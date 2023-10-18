import { Injectable } from "@angular/core";
import { ImportLookupResponse } from "../Models/Response/import-lookup-response";
import { LookupService } from "../Data/lookupservice";
import { LocationLookupsResponse } from "../Models/Response/location-lookups-response";
import {UserLookupsResponse } from "../Models/Response/user-lookups-response";

@Injectable({
    providedIn: 'root'
  })
export class LookupBl {

    constructor(private _lookupService : LookupService)
    {
        
    }

    public async GetImportLookup() : Promise<ImportLookupResponse>
    {
        var response = await this._lookupService.ImportGet();

        return response;
    }

    public async GetLocationLookups() : Promise<LocationLookupsResponse>
    {
        var response = await this._lookupService.GetLocationLookups();
        
        return response;
    }

    public async GetUserLookups(userId : number) : Promise<UserLookupsResponse>
    {
        var response = await this._lookupService.GetUserLookups(userId);

        return response;
    }
}
