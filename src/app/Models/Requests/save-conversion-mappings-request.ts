import { ColMapDto } from "../Dtos/col-map-dto";
import { ConversionDto } from "../Dtos/conversion-dto";
import { MapHeaderDto } from "../Dtos/map-header-dto";

export class SaveConversionMappingsRequest {

    Mapped : MapHeaderDto[];
    ConversionDto : ConversionDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
