import { MediatorService } from '../Services/mediator.service';
import { BaseResponse } from '../Models/Response/response';
import { ToastrService } from 'ngx-toastr';


export class ApiBase 
{
    constructor(private _mediatorService:MediatorService,private _toastr: ToastrService) {}

    public ProcessResponse(response : BaseResponse)
    { 
        if (response.status && response.showMsg)
        {
            this._toastr.show(response.message, response.title, { positionClass: 'toast-top-full-width',titleClass: "custom-title-green"});
            return;
        }
            
        if (response.status && !response.showMsg)
            return;

        this._toastr.show(response.message, "An error occured", { positionClass: 'toast-top-full-width',titleClass: "custom-title-red"});

    }
}