import { Injectable } from "@angular/core";
import { EncorderService } from "../Data/encorder-service";
import { ClientDto } from "../Models/Dtos/client-dto";
import { EncoderDto } from "../Models/Dtos/encoder-dto";
import { CreateEncoderRequest } from "../Models/Requests/create-encoder-request";
import { CreateEncoderResponse } from "../Models/Response/create-template-response";
import { GetEncoderResponse } from "../Models/Response/get-encoder-response";

@Injectable({
    providedIn: 'root'
  })
export class EncoderBl {
    constructor(private _encoderService : EncorderService)
    {
    }

    public async Get(clientId : number) : Promise<GetEncoderResponse>
    {
        var response = await this._encoderService.Get(clientId);

        return response;
    }

    public async Create(name :string, client : ClientDto) : Promise<CreateEncoderResponse>
    {
        var encoder = new EncoderDto({
            client : client,
            name : name,
            defaultEncoder : false
        })

        var request = new CreateEncoderRequest({
            Encoder : encoder,
            encoder : encoder
        });

        return await this._encoderService.Create(request);
    }
    
}
