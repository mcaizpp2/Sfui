import { EncoderDto } from "../Dtos/encoder-dto";

export class CreateEncoderRequest {

    public Encoder : EncoderDto;

    public encoder : EncoderDto;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
