import { AccountFieldDto } from "./account-field-dto";

export class AccountDto {
    accountId : number;
    conversionId : number;
    name : string;
    incept : Date;
    expiry : Date;
    accountNum : Date;
    userDef1 : string;
    userText1: string;
    fields : AccountFieldDto[];
    policyDeductible : number;
    policyLimit : number;


    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}


