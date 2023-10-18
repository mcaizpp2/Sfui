import {FieldTypes} from '../Enums/field-types';
import { ValMappedDto } from '../Dtos/search-class-dto';

export class LoadValsDto 
{
    loadValId : number;

    value : string;

    field : FieldTypes;

    mapped : ValMappedDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
