export class AccountFieldDto {
  name : string;
  defaultValue : string;
  val : string;
  sortOrder : number;

  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}

