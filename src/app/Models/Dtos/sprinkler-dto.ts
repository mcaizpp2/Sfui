export class SprinklerDto {

    Id : number;
    value : string;
    text : string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}

export class LkpSprinklerType
{
  sprinklerId : number;
  text : string;
}

export class SprinklerValsDto
{
    text : string;
    sprinklerValsId : number;
    sprinklerValue : LkpSprinklerType;
    state : boolean;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
