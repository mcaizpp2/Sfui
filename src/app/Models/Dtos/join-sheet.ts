export class JoinSheet {

  workSheetId: number;
  name: string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
