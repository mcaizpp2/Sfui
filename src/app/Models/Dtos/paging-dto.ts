
export class PagingDto {

    public RecFirst : number;
    public RecLast : number;
   
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
