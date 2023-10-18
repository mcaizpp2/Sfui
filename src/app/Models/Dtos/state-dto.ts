export class StateDto {
    id : number;
    name : string;
    code : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class ValuesDto {
  id : number;
  name : string;
  code : string;
  
  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}

export class ValDto {
  id : number;
  originalValue : string;
  replacementValue : string;
  state : boolean;
  
  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
