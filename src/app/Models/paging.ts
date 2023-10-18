export class Paging {

    public Total : number;

    public First : number;

    public Last : number;

    public Current : number;

    public PageTotal : number;

    public RecFirst : number;

    public RecLast : number;

    public RecsPerPage : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
