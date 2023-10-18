import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import {FileDto} from '../Dtos/file-dto'
import { ConversionFileDto } from "../Dtos/conversion-dto";

export class FilesResponse extends BaseResponse implements IResponse {
    processedFiles: FileDto[];
    conversionFiles : ConversionFileDto[];
}
