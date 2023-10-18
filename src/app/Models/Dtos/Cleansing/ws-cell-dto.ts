import { CellTypeEnum } from '../../Enums/cell-type-enum';

export class WsCellDto {

    colIdx : number;

    cellType : CellTypeEnum;

    cellValue : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
