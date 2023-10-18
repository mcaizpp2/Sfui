import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { StateDto } from "../Dtos/state-dto";
import { BldgClassDto } from "../Dtos/bdlg-class-dto";
import { OccupancyTypeDto } from "../Dtos/occupancy-type-dto";
import { CountryDto} from "../Dtos/country-dto";
import { SprinklerDto } from '../Dtos/sprinkler-dto';

export class LocationLookupsResponse extends BaseResponse implements IResponse  {

    public states : StateDto[];

    public lstBuildingClass : BldgClassDto[];

    public occupancies : OccupancyTypeDto[];

    public countries : CountryDto[];
    
    public sprinklers : SprinklerDto[];
    
    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
    }
}
