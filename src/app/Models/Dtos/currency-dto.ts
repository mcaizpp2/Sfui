export class CurrencyDto {
    currencyId : number;
    name : string;
    fullName : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
