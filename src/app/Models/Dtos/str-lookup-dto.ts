export class StrLookupDto {

    Value : string;
    Id : string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class LookupDto{
    Id: number;
    Value : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class ComponentLkpDto {

    Id : number;
    WorkSheet : string;
    ComponentId : number;
    Value : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
