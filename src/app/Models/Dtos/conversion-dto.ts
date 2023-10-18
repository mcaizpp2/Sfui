import { AccountDto } from './account-dto';
import { BookDto } from './book-dto';
import { CurrencyDto } from './currency-dto';
import { Status } from '../Enums/status.enum';
import { RmsFieldMappingDto } from './rms-field-mapping-dto';
import { AssumptionsDto} from './assumptions-dto';
import { UserDto } from './user-dto';

export class ConversionFileDto
{
  accountName : string;
  filePath : string;
  
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
export class ConversionDto {

    convId : number;
    account : AccountDto;
    file : string;
    name : string;
    bookId: number;
    book : BookDto;
    currencyId : number;
    currency : CurrencyDto;
    status : Status;
    edit : boolean;
    workSheetName : string;
    saveConversion : boolean;
    saveAccount : boolean;
    rmsFieldMappingsDto : RmsFieldMappingDto[];
    assumptions : AssumptionsDto[];
    totalTiv : number;
    user : UserDto;
    zipPath : string;
    geoCode : boolean;
    hasLocations : boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
