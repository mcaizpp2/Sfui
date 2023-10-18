import { AssumptionType} from '../Enums/assumption-type';

export class FieldDto {

    fieldId : number;

    name : string;

    combination : boolean;

    isMappingColumn : boolean;

    rating : number;

    assumptionType : AssumptionType;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
