import { AddressDto } from './address-dto';
import { BldgClassDto } from './bdlg-class-dto'; 
import { ConfidenceDto } from './confidence-dto';
import { OccupancyTypeDto } from "./occupancy-type-dto";
import { SprinklerDto} from './sprinkler-dto';

export class LocationDto {
    reconciled : boolean;
    uniqueId : number;
    //Vals : Map<FieldDto, string>;
    locId : number;
    address : AddressDto;

    accntNum : string;

    locName : string;

    cresta : string;

    roofFrame : number;

    slope : string;

    flZone : string;

    huZone : string;

    otherZone : string;

    buildingOrig : string;

    bldgClass : BldgClassDto;

    buildingScore : number;

    occupancyOrig : string;

    occupancyType : OccupancyTypeDto;

    floorOccupancy : string;

    occupancyScore : number;

    noStories : number;

    noBuilding : number;

    eqsLins : number;

    cladSys : number;

    yearBuilt : string;

    yearUpgrade : string;

    floorArea : string;

    bi : number;

    siteDed : number;

    building : number;

    content : number;

    inventory : number;

    searchAddress : string;
       
    currency : string;

    totalTiv : number;

    tivRank : number;

    hasErrors : boolean;

   // errors : FieldLogicErrorDto[];

    sprinkler : SprinklerDto;

    sprinklerInput : string;

    segmentId : number;

    confidenceDto : ConfidenceDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}
