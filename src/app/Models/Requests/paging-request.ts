export class PagingRequest {

    public TypeId : number;
    public Filters :string;
    public Current : number;
    public RecsPerPage : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
