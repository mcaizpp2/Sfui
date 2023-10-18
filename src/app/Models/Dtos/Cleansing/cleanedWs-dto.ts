import { ComponentsDto } from "./components-dto";

export class CleanedWsDto {

    workSheet : string;

    workSheetId : number;

    components : ComponentsDto[];

    ref : string;
    
    constructor(values: Object = {}) {}

}
