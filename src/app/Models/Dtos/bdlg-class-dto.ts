export class BldgClassDto {

    scheme : string;


    code : string;

    id : number;

    name : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class BuildingClassLkpDto
{
    id : number;

    scheme : string;

    code : number;

    name : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
