import { JoinParam } from "./join-param";

export class OperationParam {

    ColIdx : number;
    RowIdx : number;
    WorksheetId : number;
    WorkSheetTwoId : number;
    MapColIdx : number;
    ValueColIdx : number;
    WorkSheet : string;
    Component : string;
    ComponentId : number;
    ComponentTwoId : number;
    WorkSheetTwo : string;
    ComponentTwo : string;
    Joins : JoinParam[];
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
