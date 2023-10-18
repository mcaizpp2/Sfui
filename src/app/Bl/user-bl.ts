import { Injectable } from "@angular/core";
import { Userservice} from '../Data/userservice';
import { GetAllUsersResponse } from "../Models/Response/get-all-users-response";
import * as CryptoJS from '../../../node_modules/crypto-js'; 
import { environment } from "../../environments/environment";
import { ChangePwdRequest } from "../Models/Requests/change-pwd-request";
import { UserDto } from "../Models/Dtos/user-dto";
import { DeleteUserRequest } from "../Models/Requests/delete-user-request";

@Injectable({
    providedIn: 'root'
  })
export class UserBl {
    constructor(private _userService : Userservice) {}

    public async Get(userId : number) : Promise<GetAllUsersResponse>
    {
        var response = await this._userService.Get(userId);

        return response;
    }

    public async ChangePwd(userId : number)
    {
        var encrypted = this.DefaultPwd();
        var request = new ChangePwdRequest({ Pwd : encrypted, UserId : userId });
        await this._userService.ChangePwd(request);
    }

    public async Delete(userId : number)
    {
        var request = new DeleteUserRequest({UserId : userId});

        await this._userService.DeleteUser(request);
    }


    public async Save(user: UserDto, add : boolean)
    {
        if (add)
            user.pwd = this.DefaultPwd()

        await this._userService.Save(user);
    }

    private DefaultPwd()
    {
        var key = CryptoJS.enc.Hex.parse(environment.encryptKey);
        var defaultPwd = environment.defaultPwd;
        var iv = CryptoJS.enc.Hex.parse(environment.iv);

        var encrypted = CryptoJS.AES.encrypt(defaultPwd, key, {iv: iv, padding: CryptoJS.pad.NoPadding}).toString();
        
        return encrypted;
        
    }
}
