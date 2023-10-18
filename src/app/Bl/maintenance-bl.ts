import { Injectable } from "@angular/core";
import { MaintenanceService } from "../Data/maintenance-service";
import { LoadValsDto } from "../Models/Dtos/load-vals-dto";
import { StageRequest } from "../Models/Requests/stage-request";
import { CommitRequest } from "../Models/Requests/commit-request";

@Injectable({
    providedIn: 'root'
  })
export class MaintenanceBl {

    constructor(private _maintenanceService : MaintenanceService)
    {
    }

    public async Get()
    {
        var response = await this._maintenanceService.Get();

        return response;
    }

    public async Stage(stageRequest : StageRequest)
    {
        var response = await this._maintenanceService.Stage(stageRequest);

        return response;
    }

    public async Commit(commitRequest : CommitRequest)
    {
        var response = await this._maintenanceService.Commit(commitRequest);

        return response;
    }

    public async GetTestTerms(userId : number)
    {
        var response = await this._maintenanceService.GetTestTerms(userId);

        return response;
    }

    public async DeleteLoadVal(loadValId : number)
    {
        var response = await this._maintenanceService.DeleteloadVal(loadValId);

        return response;
    }

    
}
