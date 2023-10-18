export class ClientDto {
  clientId : number;
  client : string;
  credits : number;

  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
