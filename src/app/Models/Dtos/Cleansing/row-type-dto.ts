import { WsCellDto } from "./ws-cell-dto";
import { RowTypeEnum } from '../../Enums/row-type-enum';
import { RowOptionsDto } from "./row-options-dto"

export class RowTypeDto {

     rowIdx : number;

     cells : WsCellDto[];

     row : RowTypeEnum

     pattern : string

     show : boolean;

     isHeader : boolean;

     rowOptions : RowOptionsDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
