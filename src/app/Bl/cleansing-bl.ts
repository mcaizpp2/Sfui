import { Injectable } from "@angular/core";
import { CleansingService } from "../Data/cleansing-service";
import { CleanLoadRequest } from "../Models/Requests/cleanse-request";
import { CleanLoadResponse } from "../Models/Response/cleanse-response";
import { GetCleansedMgrRequest } from "../Models/Requests/get-cleansed-mgr-request";
import { GetCleansedMgrResponse } from "../Models/Response/get-cleansed-mgr-response";
import { NewCleansedResponse } from "../Models/Response/new-cleansed-response";
import { NewCleansedRequest } from "../Models/Requests/new-cleansed-request";
import { Status } from "../Models/Enums/status.enum";
import { PagingDto } from "../Models/Dtos/paging-dto";
import { AddOperationResponse } from "../Models/Response/add-operation-response";
import { AddOperationRequest } from "../Models/Requests/add-operation-request";
import { OperationParam } from "../Models/Dtos/Cleansing/operation-param";
import { OperationTypeDto } from "../Models/Dtos/Cleansing/operation-type-dto";
import { OperationsResponse } from "../Models/Response/operations-response";
import { DeleteOperationResponse } from "../Models/Response/delete-operation-response";
import { JoinCriteria } from "../Models/Dtos/Cleansing/join-criteria";
import { CleanseExportResponse } from "../Models/Response/cleanse-export-response";
import { UserDto } from "../Models/Dtos/user-dto";
import { CleanseExportRequest } from "../Models/Requests/cleanse-export-request";
import { MenuOption } from "../Models/Dtos/Cleansing/menu-option";
import { ReplayResponse } from "../Models/Response/replay-response";
import { ReplayRequest } from "../Models/Requests/replay-request";
import { DeleteCleanseMgrResponse } from "../Models/Response/delete-cleanse-mgr-response";

@Injectable({
    providedIn: 'root'
  })
export class CleansingBl {

    constructor(private _cleansingService : CleansingService) {}

    public async New(name : string, userId : number, file : File) : Promise<NewCleansedResponse>
    {
        var newCleansedRequest = new NewCleansedRequest ({
            name : name,
            userId : userId,
            status : Status.Imported
        });
        
        var response = await this._cleansingService.New(newCleansedRequest, file);

        return response;
    }

  public async Delete(cleanseMgrId: number): Promise<DeleteCleanseMgrResponse> {
    var response = await this._cleansingService.Delete(cleanseMgrId);
    return response;
  }

    public async Load(cleanseMgrId : number, show : boolean = true) : Promise<CleanLoadResponse>
    {
        var cleanLoadRequest = new CleanLoadRequest 
        ({
            CleanseMgrId : cleanseMgrId,
            Show : show
        });

        var response = await this._cleansingService.Load(cleanLoadRequest);

        return response;
    }
    public async LoadOperations(cleanseMgrId : number) : Promise<OperationsResponse>
    {
        var response = await this._cleansingService.LoadOperations(cleanseMgrId);

        return response;
    }

    public async AddOperation(cleansedMgrId : number, operationType : OperationTypeDto, menuOption : MenuOption, componentTwoIdx : number, workSheetTwoIdx : number, mapColIdx : number, valueColIdx : number, joins : JoinCriteria[] = null) : Promise<AddOperationResponse>
    {
        var opParam = new OperationParam({

            WorkSheetId : menuOption.WorkSheetId,
            Component : menuOption.ComponentName,
            WorkSheet : menuOption.WorkSheet,
            ComponentId : menuOption.ComponentId,  
            ColIdx : menuOption.ColIdx,
            RowIdx : menuOption.RowIdx,
            Joins : joins,
            ComponentTwoId : componentTwoIdx,
            WorkSheetTwoId : workSheetTwoIdx,
            MapColIdx : mapColIdx,
            ValueColIdx : valueColIdx
        });
 
        var addOperationRequest = new AddOperationRequest
        ({ 
            OperationsType : operationType, 
            CleansedMgrId : cleansedMgrId,
            OperationsParam : opParam
        });

        var response = await this._cleansingService.AddOperation(addOperationRequest)

        return response;
    }

    public async Get(pagingDto : PagingDto, userId : number) : Promise<GetCleansedMgrResponse>
    {
        var request = new GetCleansedMgrRequest({
            userId : userId,
            RecFirst : pagingDto.RecFirst,
            RecLast : pagingDto.RecLast
        });
        
        var response = await this._cleansingService.Get(request);

        return response;
    }

    public async DeleteOperation(operationId : number) : Promise<DeleteOperationResponse>
    {
        var response = await this._cleansingService.DeleteOperation(operationId);

        return response;
    }

    public async Replay(cleanseMgrId : number, copyFromId : number,  name : string, file : File, user : UserDto) : Promise<ReplayResponse>
    {
        var replayRequest = new ReplayRequest
        ({
           CleanseMgrId : cleanseMgrId,
           CopyFromId : copyFromId,
           Name : name,
           UserId : user.userId
        });

        var response = await this._cleansingService.Replay(replayRequest, file);

        return response;
    }

    public async Export(cleanseMgrId : number, user : UserDto) : Promise<CleanseExportResponse>
    {
        var cleanseExportRequest = new CleanseExportRequest
        ({
            User : user,
            CleanseMgrId : cleanseMgrId
        });
        
        var response = await this._cleansingService.Export(cleanseExportRequest);

        return response;
    }
}
