"use strict"

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { LookupBl } from '../../Bl/lookup-bl';
import { CurrencyDto } from '../../Models/Dtos/currency-dto';
import {WorkSheetDto} from '../../Models/Dtos/work-sheet-dtos';
import * as XLSX from 'xlsx';
import { ConversionService } from '../../Services/conversion.service';
import { ConversionDto } from '../../Models/Dtos/conversion-dto';
import { AccountDto } from '../../Models/Dtos/account-dto';
import {ManagerBl } from '../../Bl/manager-bl';
import {NgbDate} from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
import { FieldDto } from '../../Models/Dtos/field-dto';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  public ImportForm : FormGroup;
  public FilePath : string = 'Please Drop SOV File Here';
  public Errors : string[] = [];
  public Currencies : CurrencyDto[];
  public WorkSheets : WorkSheetDto[] =[];

  private _file : File;

  private _conversion : ConversionDto;

  public IsEdit : boolean = false;

  public AddFields : FieldDto;

  constructor(private _formBuilder: FormBuilder, private _lookupBl: LookupBl, 
    private _conversionService : ConversionService,
    private _managerBl : ManagerBl, private _router : Router) { }


  ngOnInit() {

    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);

    this.AddFields = new FieldDto();
     this._conversion = this._conversionService.Get();
  
    this.ConstructFormBuilder();

    if (!this._conversion.edit){
      this.Errors.push('Please select an SOV');
    }
      else
      {
        //this.FilePath = this._conversion.file;
        this.IsEdit = true;
      }

    this.LoadLookups();

    if (this._conversion.edit)
    {
      this.LoadVals();
    }

  }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    var file = event.target.files[0]

    let ext = file.name.split('.')[file.name.split('.').length - 1];
    if(ext == 'xlsx')
    {
      this._file = file;
      this.FilePath = file.name;
      this.ReadXl(file);
    }
    else
    {
       this.Errors.push(file.name + " does not have a valid file type");
       this.Errors.push('Please select an SOV');
    }

  }

  private LoadVals()
  {
    var ctrls = this.ImportForm.controls;

    ctrls['Name'].setValue(this._conversion.account.name);

    ctrls['WorkSheet'].setValue(this._conversion.workSheetName);

    ctrls['Currency'].setValue(this._conversion.currency.currencyId);
    ctrls['Num'].setValue(this._conversion.account.accountNum);

    var inceptNormal = new Date(this._conversion.account.incept);

    var ngIncept = this.FormatNgDate(inceptNormal);
    ctrls['Inception'].setValue(ngIncept);

    var expiryNormal = new Date(this._conversion.account.expiry);

    var ngExpiry = this.FormatNgDate(expiryNormal);
    ctrls['Expiry'].setValue(ngExpiry);

    ctrls['Tiv'].setValue(this._conversion.totalTiv);
    ctrls['FilePath'].setValue(this._conversion.file);
    ctrls['UsrTxt1'].setValue(this._conversion.account.userText1);
    ctrls['UsrDef1'].setValue(this._conversion.account.userDef1);
    ctrls['Deductible'].setValue(this._conversion.account.policyDeductible);
    ctrls['Limit'].setValue(this._conversion.account.policyLimit);
  }

  private FormatNgDate(date : Date)
  {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  private async LoadLookups()
  {
    var lookupResponse = await this._lookupBl.GetImportLookup();

    if (lookupResponse.status)
    {
      this.Currencies = lookupResponse.currencies;
    }
    
  }
  private ConstructFormBuilder()
  {
    this.ImportForm = this._formBuilder.group({
      Name: [null, Validators.required],
      Currency: [null, Validators.required],
      WorkSheet : [null, Validators.required],
      Num : [null, Validators.required],
      Inception : [null],
      Expiry : [null],
      Tiv : [null,Validators.required],
      FilePath : [null],
      UsrDef1 : [null],
      UsrTxt1 : [null],
      Deductible : [null],
      Limit : [null]
      });
  }

  private ReadXl(file:File)
  {
    const reader: FileReader = new FileReader();
     
    reader.onload = (e: any) => {
     
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});


      var sheets = wb.SheetNames;
      this.WorkSheets = [];
      sheets.forEach(x=>
        {
            this.WorkSheets.push(new WorkSheetDto({ Name : x}));
        });
    };

		reader.readAsBinaryString(file);
       
  }

  public async Save(mapNew : boolean)
  {
   // this._loadingBarService.start();
    if (!this._conversion.edit)
    {
      this._conversion.account = new AccountDto();
    }

    var ctrls = this.ImportForm.controls;

    var name = ctrls['Name'].value;
    this._conversion.name = name;
    this._conversion.account.name = name;

    var worksheet = ctrls['WorkSheet'].value;
    this._conversion.workSheetName = worksheet;

    var currencyId = ctrls['Currency'].value;
    var currency = this.Currencies.find(x=> x.currencyId == currencyId);
    this._conversion.currency = currency;
    this._conversion.currencyId = currencyId;

    var accNum = ctrls['Num'].value;
    this._conversion.account.accountNum = accNum;

    var inception = ctrls['Inception'].value;

    if (inception)
    {
      if (inception.year == 9999)
      {
        this._conversion.account.incept = new Date('9999/12/31');
      }
      else
      {
        this._conversion.account.incept = this.transform(inception);
      }
     
    }
    else
    {
      inception = new Date('9999/12/31');
      this._conversion.account.incept = inception;
    }
   

    var expiry = ctrls['Expiry'].value;

    if (expiry)
    {
      if (expiry.year == 9999)
      {
        this._conversion.account.expiry = new Date('9999/12/31');
      }
      else{
        this._conversion.account.expiry = this.transform(expiry);
      }
      
    }
    else{
      expiry = new Date('9999/12/31');
      this._conversion.account.expiry= expiry;
    }
    //this._conversion.account.expiry = this.transform(expiry);

    var tiv = ctrls['Tiv'].value;
    this._conversion.totalTiv = tiv;

    var usrTxt = ctrls['UsrTxt1'].value;
    this._conversion.account.userText1 = usrTxt;

    var usrDef = ctrls['UsrDef1'].value;
    this._conversion.account.userDef1 = usrDef;

    var deductible = ctrls['Deductible'].value;
    this._conversion.account.policyDeductible = deductible;

    var limit = ctrls['Limit'].value;
    this._conversion.account.policyLimit = limit;

    if (!this._conversion.edit)
    {
      //now we should create or save the conversion.
      var uploadResponse = await this._managerBl.UploadFile( this._file,  worksheet,name);

      if (uploadResponse.status)
      {
        this._conversion.file = uploadResponse.fileName;
        this._conversion.workSheetName = uploadResponse.workSheetName;
      }
      else{
        //we should display messages to user here
        this.Errors = uploadResponse.messages;
        return;
      }

    }

    this._conversion.saveConversion = true;
    this._conversion.saveAccount = true;

    this._conversionService.Set(this._conversion);

    var saveConversionResponse = await this._managerBl.SaveImport(this._conversion);
    
    //this._loadingBarService.complete();
    
    if (saveConversionResponse.status)
    {
      this._conversion.saveConversion = false;
      this._conversion.saveAccount = false;
    
      this._conversion.convId = saveConversionResponse.conversionId;
      this._conversionService.Set(this._conversion);

      if (mapNew)
        this._router.navigate(['/mappingNew']);
      else
        this._router.navigate(['/mapping']);
    }
  }

  transform(value: NgbDate): Date {
    return new Date(value.year, value.month, value.day);
}

    
  

}
