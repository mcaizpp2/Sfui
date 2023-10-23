export class JoinComp {

  workSheetId: number;
  compIdx: number;
  name: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
