export class AuthenticateRequest {

    public UserName : string;
    public Pwd : string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
