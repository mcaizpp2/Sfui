export class ChangePwdRequest {

    public UserId : number;
    public Pwd : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
