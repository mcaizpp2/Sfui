export class CountryDto {

    countryId : number;
    countryTxt  : string;
    isoCode : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
