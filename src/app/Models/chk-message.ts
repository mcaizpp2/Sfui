export class ChkMessage{
    LocId : number;
    Checked : boolean;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}