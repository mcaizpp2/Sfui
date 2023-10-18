import { FilterDto } from '../Dtos/filter-dto';

export class DistinctInputs {

    building : FilterDto[];

    occupancy : FilterDto[];

    sprinkler : FilterDto[];

    public disType : number = 0;

    public selectedDisSprinkler : string;
    public selectedDisOccupancy : string;
    public selectedDisBuilding : string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
        this.disType = 0;
    }
}
