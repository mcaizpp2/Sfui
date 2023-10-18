import {ClientDto} from './client-dto';

export class EncoderDto {

    encoderId : number;

    name : string;

    defaultEncoder : boolean;

    client : ClientDto;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
