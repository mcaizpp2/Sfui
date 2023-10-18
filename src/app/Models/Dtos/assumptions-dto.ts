export class AssumptionsDto {
    assumptionId : number;

    assumption : string;

    order : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
