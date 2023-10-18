
import { StrLookupDto } from '../str-lookup-dto';

export class JoinCriteria {

    Id : number;
    CompOne : string;
    CompOneWs : string;

    SelectedJoinType : number;

    CompOneSelected : string;

    CompTwoSelected : string;

    CompTwoHeaders : StrLookupDto[];

    CompOneColName : string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
