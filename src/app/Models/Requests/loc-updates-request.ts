import {LocUpdatesDto } from '../Dtos/loc-updates-dto';
import { SummaryDto } from '../Dtos/summary-dto';

export class LocUpdatesRequest 
{
    ConvId : number;
    LocationUpdates : LocUpdatesDto[];
    SummaryDto : SummaryDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
