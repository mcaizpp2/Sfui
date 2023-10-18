export class HeaderDto {
    header : string;
    address : string;
    colIdx : number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
