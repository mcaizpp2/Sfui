import { SprinklerValsDto } from "../Dtos/sprinkler-dto";

export class UpdateSprinklerRequest {

    SprinklerValue : SprinklerValsDto;

    constructor(values: Object = {}) 
    {
        Object.assign(this, values);
    }
}
