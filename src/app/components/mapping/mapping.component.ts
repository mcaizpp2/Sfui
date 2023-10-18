import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConversionService } from '../../Services/conversion.service';
import { MappingBl } from '../../Bl/mapping-bl';
import { ColMapDto } from '../../Models/Dtos/col-map-dto';
import { FieldDto } from '../../Models/Dtos/field-dto';
import { Router } from '@angular/router';
import { MappingValDto } from '../../Models/Dtos/mapping-val-dto';
import { Severity } from '../../Models/Enums/severity.enum';
//import { LoadingBarService } from 'ngx-loading-bar';
import { MessageService } from '../../Services/message-service';
import { HeaderDto } from '../../Models/Dtos/header-dto';
import { MapHeaderDto } from '../../Models/Dtos/map-header-dto';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit, AfterViewInit {

  // public progress: NgProgress,
  constructor( private _conversionService : ConversionService, private _mappingBl : MappingBl,
    private _router : Router,
    private _messagingService : MessageService) { }

  //private _progressRef: NgProgressRef;
  public Suggestions: MapHeaderDto[];
  public Headers : HeaderDto[];
  public Mappings : ColMapDto[];
  public SelectedAdd : string;
  public SelectedSuggestion : number = null;
 
  public IsCollapsed : boolean = true;
  public Validations : MappingValDto[];
  public MapDisabled = true;

  private _allValidations : MappingValDto[];

  public ValTxt : string;

 
  public OnChange()
  {
    this.ConfigValidations();
  }

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

    let i = 1;
    if (colMapResponse.status)
    {
      colMapResponse.suggestions.forEach(x=>
      {
        x.displayField = x.header + " : " + x.selected.name;
        x.id = i;
        i++;
      });

      this.Suggestions = colMapResponse.suggestions;
      this.Headers = colMapResponse.headers;

      i = 0;
      colMapResponse.columnMappings.forEach(x=>
        {
          x.id = i;
            i++;
        });
      this.Mappings = colMapResponse.columnMappings;
      this.ConfigValidations();
    }

    //this._loadingBarService.complete();
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
    var selectMappings = this.Mappings.filter(fil=> fil.selected.fieldId > 0);

    var p : number[] = [];

    var t = selectMappings.forEach(sl=>
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

        this.ValTxt = "(" + warningCtr + " Warnings, " + errorCtr + " Errors)"
  }
  public AddColumn()
  {
    var replace : ColMapDto[] = [];
    var colHeaderDto = this.Mappings.find(x=> x.column.header == this.SelectedAdd);
    var newAdd = new ColMapDto({column:colHeaderDto.column, fields:this.Mappings[0].fields, selected : new FieldDto});

    replace.push(newAdd);
    this.Mappings.forEach(x=>
    {
        replace.push(x);
    });

    let i = 0;
    replace.forEach(x=>
      {
        x.id = i;
        i++;

      });
   this.SelectedAdd = null;
   this.Mappings = replace;
  }

  public AddSuggestion()
  {
    var colCtr = this.Mappings.length + 1;
    var replace  = ColMapDto[colCtr] = [];
    var suggestion = this.Suggestions.find(x=> x.id == this.SelectedSuggestion);

 
    replace.push(suggestion);

    this.Mappings.forEach(x=>
    {
        replace.push(x);
    });
    let i = 0;
    replace.forEach(x=>
    {
      x.Id = i;
      i++;

    });
    this.SelectedSuggestion = null;
    this.Mappings = replace;
    this.ConfigValidations();
  }

  public async SaveFields()
  {
    this._messagingService.LoadingMsg(true);
    var conversion = this._conversionService.Get();
    var response = await this._mappingBl.SaveMapping(null, conversion);

    if (response.status)
    {
      conversion.rmsFieldMappingsDto = response.rmsFieldMappingsDto;
      this._conversionService.Set(conversion);
    }
    //this._loadingBarService.complete();
    this._messagingService.LoadingMsg(false);
    this._router.navigate(['/locations']);

    
  }
}
