import { Injectable } from '@angular/core';
import { ConversionDto } from '../Models/Dtos/conversion-dto';
import { AuthenticationService } from '../Data/authentication-service';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  private _conversion : ConversionDto;
  private _file : File;
  constructor(private _authenticationService : AuthenticationService) { }

  public Set(conversion : ConversionDto)
  {
    this._conversion = conversion;
    this._conversion.edit = true;
  }

  public SetFile(file : File)
  {
    this._file = file;
  }

  public Get()
  {
    var user = this._authenticationService.currentUserValue;
    if (this._conversion == null)
    {
      this._conversion = new ConversionDto({ edit: false, User : user,convId :-99});
    }
    return this._conversion;
  }
}
