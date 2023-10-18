export class CompareRequest {

    public ProcessedFile : string;
    public DroppedWs : string;
    public ProcessedWs : string;
    public AccountName : string;
    public StartIdx : number;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
