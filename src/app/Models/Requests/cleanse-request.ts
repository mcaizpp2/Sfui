export class CleanLoadRequest {

  CleanseMgrId : number;
  Show : boolean;
  
  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
