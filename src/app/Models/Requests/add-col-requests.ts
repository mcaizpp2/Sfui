import { MapHeaderDto } from "../Dtos/map-header-dto";

export class AddColRequest {

    public MapHeaderDtos : MapHeaderDto[];
    public Add : MapHeaderDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
