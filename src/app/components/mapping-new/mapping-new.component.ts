import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConversionService } from '../../Services/conversion.service';
import { MappingBl } from '../../Bl/mapping-bl';
import { FieldDto } from '../../Models/Dtos/field-dto';
import { Router } from '@angular/router';
import { MappingValDto } from '../../Models/Dtos/mapping-val-dto';
import { Severity } from '../../Models/Enums/severity.enum';
import { MessageService } from '../../Services/message-service';
import { HeaderDto } from '../../Models/Dtos/header-dto';
import { MapHeaderDto } from "../../Models/Dtos/map-header-dto";

@Component({
  selector: 'app-mapping-new',
  templateUrl: './mapping-new.component.html',
  styleUrls: ['./mapping-new.component.css']
})
export class MappingNewComponent implements OnInit, AfterViewInit {

  constructor( private _conversionService : ConversionService, private _mappingBl : MappingBl,
    private _router : Router,
    private _messagingService : MessageService) { }

  public GeoCode : boolean = false;
  public Suggestions : MapHeaderDto[];
  public Headers : HeaderDto[];
 // public Mappings : ColMapDto[];
  public SelectedAdd : string;
  public SelectedSuggestion : number = null;
 
  public IsCollapsed : boolean = true;
  public Validations : MappingValDto[];
  public MapDisabled = true;
  //public Ctr : number = 0;
  public MappingHeaders : MapHeaderDto[];

  private _allValidations : MappingValDto[];

  private _hasMappingsChanged : boolean = false;
  public ValTxt : string;

  public SampleData : string[][];

  async ngAfterViewInit() {

    this._messagingService.LoadingMsg(true);
    //this._loadingBarService.start();

    var conversion = this._conversionService.Get();
    if (conversion.convId === -99)
    {
      this._router.navigate(['/manager']);
      return;
    }

    var conversion = this._conversionService.Get();

    this.GeoCode = conversion.geoCode;
    
    var conversionMappingsResponse = await this._mappingBl.GetValidations();
 
    if (conversionMappingsResponse.status)
      this._allValidations = conversionMappingsResponse.validations;

    if (!conversion.convId)
    {
     // this._loadingBarService.complete();
      this._messagingService.LoadingMsg(false);
      return;
    }
     
    var colMapResponse = await this._mappingBl.Map(conversion.convId);

    this.MappingHeaders = colMapResponse.mapHeaders;

    this.SampleData = colMapResponse.sampleData;
    let i = 1;
    if (colMapResponse.status)
    {
      colMapResponse.suggestions.forEach(x=>
      {
        x.displayField = x.header.header + " : " + x.selected.name;
        x.id = i;
        i++;
      });

      this.Suggestions = colMapResponse.suggestions;
      this.Headers = colMapResponse.headers;

      this.ConfigValidations();
    }

    this._messagingService.LoadingMsg(false);
  }

  async ngOnInit() {}

  public EnumType (severity : Severity)
  {
    if (severity == Severity.High)
      return 1;

    if (severity == Severity.Medium)
    return 2;
    
  }

  private ConfigValidations()
  {
    this.Validations = [];

    var warningCtr = 0;
    var errorCtr = 0;
    this.MapDisabled = false;
    var selectMappings = this.MappingHeaders.filter(fil=> fil.selected.fieldId > 0);



    var duplicate = this.reduce();

    var p : number[] = [];
    selectMappings.forEach(sl=>
    {
        p.push(sl.selected.fieldId);
    });
    this._allValidations.forEach(av=>
    {
        var hasField = p.find(x=> x == av.field.fieldId || (av.field.fieldId == 18 && x == 3044));
        
        if (!hasField)
        {
          if (av.warningType == Severity.High)
            errorCtr++;
          
          if (av.warningType == Severity.Medium)
            warningCtr++;

          if (!this.MapDisabled && av.warningType == Severity.High)
          {
            this.MapDisabled = true;
          }
          this.Validations.push(av);
        } 
    });

    duplicate.forEach(d=>
    {
      errorCtr++;
    });

    this.ValTxt = "(" + warningCtr + " Warnings, " + errorCtr + " Errors)"
  }

  reduce(){
    var valFields : number[] = [];
    var multipleHeaders : MapHeaderDto[] = [];
  
    this.MappingHeaders.forEach(mh=>
    {
       if (mh.selected.fieldId > 0)
       {

       
        var headers = this.MappingHeaders.filter(x=> x.selected.fieldId == mh.selected.fieldId);

        if (headers.length > 1)
        {
          var exists = multipleHeaders.find(x=> x.selected.fieldId == mh.selected.fieldId);
          if (!exists)
          {
            var field = mh.fields.find(x=> x.fieldId == mh.selected.fieldId);
            if (!field.combination)
            {
              multipleHeaders.push(mh);
            }
          }
            
        }
      }

        
    });

    var ctr = this._allValidations.length + 1;
    multipleHeaders.forEach(mh=>
    {
      var field = mh.fields.find(x=> x.fieldId == mh.selected.fieldId);

      var headers = this.MappingHeaders.filter(x=> x.selected.fieldId == field.fieldId);
      var mlNames = "";
      headers.forEach(x=>
      {
          mlNames = mlNames + x.header.header + ", "
      });

      mlNames = mlNames.slice(0, -2); 
      this.Validations.push(new MappingValDto ({ mappingValId : ctr, field : field, warningType : Severity.High, valText :"Excel columns - " + mlNames + " have been mapped multiple times " }));
      valFields.push(field.fieldId);
      ctr++;
    });
    return valFields;
  }

  

  public async AddSuggestion()
  {
    var sug = this.Suggestions[this.SelectedSuggestion-1];
    var newAdd = this.CreateNewHeaderDto(sug.header.header,sug.selected);

    this.IncrementMappings();

    this.MappingHeaders.unshift(newAdd);

    this.SelectedSuggestion = null;
  
    this.ConfigValidations();
  }

  public async AddColumn()
  {
    var newAdd = this.CreateNewHeaderDto(this.SelectedAdd, null);

    this.IncrementMappings();

    this.MappingHeaders.unshift(newAdd);

    this.SelectedAdd = null;
 
    this.ConfigValidations();
  }

  private CreateNewHeaderDto(colName : string, selected : FieldDto)
  {
    var headerDto = this.MappingHeaders.find(x=> x.header.header == colName);

    var newAdd = new MapHeaderDto(
    {
      header: headerDto.header ,
      fields : headerDto.fields,
      selected : new FieldDto({ fieldId : 0, name : '' }),
      priority: 1,
      colIdx : 1
    });

    if (selected)
      newAdd.selected = selected;

    this.AddToSampleData(headerDto.colIdx-1);
      return newAdd;
  }

  private AddToSampleData(colIdx : number)
  {
    this.SampleData.forEach(x=>
    {
      var headerVal = x[colIdx];

      x.unshift(headerVal);
    });
  }

  private IncrementMappings()
  {
    this.MappingHeaders.forEach(x=>
    {
      x.colIdx++;
    });

  }  

  public OnChange()
  {
    this.ConfigValidations();
  }
  
  public async SaveFields()
  {
    this._messagingService.LoadingMsg(true);
    var conversion = this._conversionService.Get();
    debugger;
    conversion.geoCode = this.GeoCode;

    var response = await this._mappingBl.SaveMapping(this.MappingHeaders, conversion);

    debugger;
    if (response.status)
    {
      conversion.rmsFieldMappingsDto = response.rmsFieldMappingsDto;
      this._conversionService.Set(conversion);
    }
    //this._loadingBarService.complete();
    this._messagingService.LoadingMsg(false);
    this._router.navigate(['/locations']);

    
  }
  public changeNumeric(mapHeaderDto : MapHeaderDto)
  {
    var found = this.MappingHeaders.find(x=> x.colIdx == mapHeaderDto.colIdx);

    if (found)
      found.priority = mapHeaderDto.priority;
  }
}
