export class CompHeaderDto {

  colIdx: number;
  colName: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
