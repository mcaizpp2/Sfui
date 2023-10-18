import { DistinctInputs } from "./distinct-inputs";

export class SummaryDto {

    sprinkler : UnknownDto[];
    occupancy : UnknownDto[];
    buildingClass : UnknownDto[];
    buildingRating : UnknownDto[];
    occupancyRating : UnknownDto[];
    count : number;
    selectedSprinkler : string;
    selectedOccupancy : string;
    selectedBuilding : string;
    selectedBuildingRating : string;
    selectedOccupancyRating : string;
    type : number = 0;
    public distinctInputs : DistinctInputs;
    ratingType : number = 0;

    constructor(values: Object = {}) {
        Object.assign(this, values);
        this.type = 0;
        this.ratingType = 0;
    }
}

export class UnknownDto
{
  text : string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
