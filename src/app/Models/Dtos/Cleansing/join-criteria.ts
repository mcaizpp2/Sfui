import { StrLookupDto } from '../str-lookup-dto';
import { CompHeaderDto } from "./header-dto";

export class JoinCriteria {

    Id : number;
    CompOne : string;
    CompOneWs : string;

    SelectedJoinType : number;

    CompOneSelected : string;

    CompTwoSelected : string;

    CompTwoHeaders: CompHeaderDto[];

    CompOneColName : string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
