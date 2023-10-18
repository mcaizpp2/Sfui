import { WorkSheetDto } from "../Dtos/work-sheet-dtos";
import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";

export class GetWorkSheetsResponse extends BaseResponse implements IResponse {

    public workSheets : WorkSheetDto[];

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
