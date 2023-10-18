import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, OnDestroy, NgZone } from '@angular/core';
import { LocationBl } from '../../../Bl/location-bl';
import { ConversionService } from '../../../Services/conversion.service';
import { ToastrService } from 'ngx-toastr';
import { LocationDto } from '../../../Models/Dtos/location-dto';
import { GridOptions } from "ag-grid-community";
import { OccupancyTypeDto } from '../../../Models/Dtos/occupancy-type-dto';
import { OccupancyLkpDto } from '../../../Models/Dtos/occupancy-lkp-dto';
import { FieldTypes } from '../../../Models/Enums/field-types';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupBl} from '../../../Bl/lookup-bl';
import { AssumptionsDto } from '../../../models/Dtos/assumptions-dto';
import { StateDto} from '../../../models/Dtos/state-dto';
import { BuildingClassLkpDto } from '../../../Models/Dtos/bdlg-class-dto';
import { MessageService } from '../../../Services/message-service';
import { CountryDto } from '../../../Models/Dtos/country-dto';
import { Router } from '@angular/router';
import { ConversionDto } from '../../../Models/Dtos/conversion-dto';
import { ManagerBl } from '../../../Bl/manager-bl';
import { CheckBoxCellComponent } from '../../../AgGrid/checkbox-cell-component';
import { MediatorService } from '../../../Services/mediator.service';
import { SprinklerDto } from '../../../Models/Dtos/sprinkler-dto';
import { SummaryDto, UnknownDto } from '../../../Models/Dtos/summary-dto';
import { Subscription, timer } from 'rxjs';

import { FilterDto } from '../../../Models/Dtos/filter-dto';
import { ConfidenceDto } from '../../../models/Dtos/confidence-dto';
import { NotificationMessage } from 'src/app/Models/notification-message';
import { MessageType } from '@microsoft/signalr';
import { SignalrMessageType } from 'src/app/Models/Enums/message-type';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('state',{static: true}) stateElement : TemplateRef<any>;
  @ViewChild('txt',{static: true}) txtElement : TemplateRef<any>;
  @ViewChild('occ',{static: true}) occElement : TemplateRef<any>;
  @ViewChild('occInput',{static: true}) occInputElement : TemplateRef<any>;
  @ViewChild('building',{static: true}) buildingElement : TemplateRef<any>;
  @ViewChild('buildingInput',{static: true}) buildingInputElement : TemplateRef<any>;
  @ViewChild('country',{static: true}) countryElement : TemplateRef<any>;
  @ViewChild('locName',{static: true}) locNameElement : TemplateRef<any>;
  @ViewChild('county',{static: true}) countyElement : TemplateRef<any>;
  @ViewChild('sprinkler',{static: true}) sprinklerElement : TemplateRef<any>;
  @ViewChild('load',{static: true}) loadElement : TemplateRef<any>;
  private _gridApi;
  private _gridColumnApi;

  public NoRowsTemplate =
  "<span style='font-weight:bold; color:#17a2b8; font-size:12px'>No Locations Records Returned</span>";

  private _selectedRowData : LocationDto;
  public HasLoaded : boolean = false;
  public HasCompleted : boolean = false;
  public Options:GridOptions;
  public LocOptions:GridOptions;
  public Locations : LocationDto[];
  public CommonOccupancies : OccupancyTypeDto[];
  public Occupancies : OccupancyLkpDto[] = [];
  public OccupancyCopies : OccupancyLkpDto[] = []; 
  public BuildingClassCopies : BuildingClassLkpDto[] = []; 
  public BuildingClass : BuildingClassLkpDto[] = [];
  public Assumptions : AssumptionsDto[];
  public SelectedRow : number;
  public RowsLoaded : boolean;
  public States :StateDto[];
  public Countries : CountryDto[];
  public Sprinklers : SprinklerDto[];
  public SelectedStateId : number;
  public SelectedCountryId : number;
  public SameValCtr : number;
  public Apply : boolean;
  public SelectedTxt : string;
  public TotalTiv : number;
  public ModalTitle : string;
  public SelectedOccupancyTypeId : number;
  public IsUnknown : boolean = false;
  public SelectedBuildingId : number;
  private _selectedCol : FieldTypes;
  public LocsWithNoOccupancyCtr : number;
  public RowSelection : string = 'single';
  public HasReconciled : boolean;
  public ReconcileComplete : boolean;
  public SelectedSprinklerId : number;
  private _reconciled : LocationDto[] = [];
  public FieldInput : string;
  public Confidence : ConfidenceDto;

  public SummaryBtn : string = "Summary";
  public SummaryDto : SummaryDto;

  private _progSub : Subscription;

  public ProgressTxt : string;
  public ProgressPercent : string = '0';
  public ParsingStarted : boolean = false;
  public ParsingHeader : string;
  public CountryTxt : string;

  public ColumnDefs = [
    {headerName: '', field: 'reconciled', width:20, cellRendererFramework: CheckBoxCellComponent,
    headerClass:'ag-custom-header',pinned: 'left', filter:true },
   
    {headerName: '#', field: 'uniqueId', width:30, headerClass:'ag-custom-header',pinned: 'left'},
    {headerName: 'LocName', field: 'locName' , width:130,headerClass:'ag-custom-header',resizable: true,filter:true},
    {headerName: 'Street', filter:true, field: 'address.streetName', width:130, headerClass:'ag-custom-header', resizable: true},
    {headerName : 'StateCode', filter:true, field:'address.stateCode.code', width:100,headerClass:'ag-custom-header', resizable: true,editable: false },
    {headerName : 'State', filter:true, colId: 'state', field:'address.state', width:100,headerClass:'ag-custom-header', resizable: true},
    {headerName : 'County',filter:true,  field:'address.county', width:100,headerClass:'ag-custom-header', resizable: true},
    {headerName : 'Country',filter:true,  field:'address.country', width:100,headerClass:'ag-custom-header', resizable: true},
    {headerName : 'Building Input', filter:true, field:'buildingOrig', width:250,headerClass:'ag-custom-header', resizable: true},
    
    {headerName : 'Building Class', filter:true,  field:'buildingClass', width:250, headerClass:'ag-custom-header', resizable: true, valueGetter: function(params) {
      return params.data.bldgClass.scheme + " - " + params.data.bldgClass.code + " - " + params.data.bldgClass.name;}},
      {headerName : 'Building Rating',filter: 'agNumberColumnFilter', field:'buildingScore', width:230,headerClass:'ag-custom-header' , resizable: true},
    
      
      {headerName : 'Occupancy Input',filter:true,  field:'occupancyOrig', width:250,headerClass:'ag-custom-header' , resizable: true},
     
      {headerName : 'Occupancy', filter:true,  field:'bldgClass',headerClass:'ag-custom-header', width:250,resizable: true, valueGetter: function(params) {
    
      return params.data.occupancyType.scheme + " - " + params.data.occupancyType.code + " - " + params.data.occupancyType.name;}},
      {headerName : 'Occupancy Rating',filter: 'agNumberColumnFilter', field:'occupancyScore', width:230,headerClass:'ag-custom-header' , resizable: true},
    
      {headerName : 'Sprinkler Input',filter:true,  field:'sprinklerInput', width:50,headerClass:'ag-custom-header', resizable: true},
      {headerName : 'Sprinkler',filter:true,  field:'sprinkler.value', width:50,headerClass:'ag-custom-header', resizable: true},
      {headerName : 'YearBuilt', field:'yearBuilt', width:100,headerClass:'ag-custom-header' , resizable: true},
      {headerName : 'YearUpgrad', field:'yearUpgrade', width:100,headerClass:'ag-custom-header' , resizable: true},
      {headerName : 'Building', field:'building', width:120,headerClass:'ag-custom-header', resizable: true },
      {headerName : 'BI', field:'bi', width:120,headerClass:'ag-custom-header', resizable: true },
      {headerName : 'Content', field:'content', width:120,headerClass:'ag-custom-header', resizable: true},
      {headerName : 'Inventory', field:'inventory', width:120,headerClass:'ag-custom-header' , resizable: true},
      {headerName : 'Tiv Rank', field:'tivRank', width:85,headerClass:'ag-custom-header' , resizable: true},
      {headerName : 'Tiv', field:'totalTiv', width:200,headerClass:'ag-custom-header' , resizable: true},
  
];

  constructor(private _locationBl : LocationBl, private _conversionService : ConversionService
    ,private _toastr: ToastrService, private _lookupBl : LookupBl,
    private _modalService: NgbModal, private _messagingService : MessageService,
    private _router : Router, private _managerBl : ManagerBl, 
    private _mediatorSerice : MediatorService, private ngZone: NgZone) { }

    ngOnDestroy()
    {
      if (this._progSub)
        this._progSub.unsubscribe();
    }
    ngOnInit()
    {
     this.initGrid();
     this.loadLookups();

     var conversion = this._conversionService.Get();

     if (conversion.hasLocations)
     {
      this.HasLoaded = true;
     }
 
     this._mediatorSerice.ConvFailed.subscribe(x=>
      {
          this._modalService.dismissAll();
      });

      this._mediatorSerice.Progressed.subscribe(x=>
        {
          this.ngZone.run( () => {
            this.ParsingStarted = true;
            this.ProgressPercent = x.progress;
            this.ProgressTxt= x.progress + '%  - ' + x.complete;
         });
           
           // this._modalService.dismissAll();
        });
     this._mediatorSerice.Checked.subscribe(x=>
      {
        this.Checked();
      });

     var sub = this._mediatorSerice.Complete.subscribe(x=>
      {
          this._modalService.dismissAll();

          this._mediatorSerice.Publish(new NotificationMessage ({ 
            messageType  : SignalrMessageType.Success, 
            subject: "Locations Mapped", 
            Refresh : false, 
            body : "The Conversion has been Mapped" }));

            var conv = this._conversionService.Get();
            conv.hasLocations = true;
            this._conversionService.Set(conv);
            this.HasLoaded = true;
          //await this.GetMapped();
          //load conversion from here 
          sub.unsubscribe();
    });

  }  
   
    public async Refresh()
    {
      await this.GetMapped();
    }

   
    private async loadLookups()
    {
      var lookupsResponse = await this._lookupBl.GetLocationLookups();

      if (lookupsResponse.status == true)
      {
        this.States = lookupsResponse.states;
        this.Countries = lookupsResponse.countries;
        this.Sprinklers = lookupsResponse.sprinklers;
        lookupsResponse.lstBuildingClass.forEach(bldg=>
        {
            var lkpType = new BuildingClassLkpDto({

              "id": bldg.id,
              "code": bldg.code,
              "name": bldg.name + ' (' + bldg.scheme + ' ' + bldg.code +')',
              "scheme": bldg.scheme
             });

             this.BuildingClass.push(lkpType);
        });

        lookupsResponse.occupancies.forEach(occ=>
        {
           var lkpType = new OccupancyLkpDto({

            "id": occ.id,
            "code": occ.code,
            "name": occ.name + ' (' + occ.scheme + ' ' + occ.code +')',
            "scheme": occ.scheme
           });
              
           this.Occupancies.push(lkpType);
        });
      }
    }

    ViewAssumptions(content) {
      this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title'});
    }

    ViewSummary(content)
    {
      this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'summaryLrg'}); 
    }

    CustomName()
    {
      this._selectedCol = FieldTypes.CustomLocName;
      this._modalService.open(this.locNameElement, { ariaLabelledBy: 'modal-basic-title'});
    }

    onCellClicked(params)
    {
      this.Apply = false;
      this.SelectedStateId = null;

      var colName = params.colDef.headerName;
      var value = params.value;

      this._selectedRowData = params.data;

      if (colName == "StateCode")
      {
        this.LoadStateValues(value);
        this._modalService.open(this.stateElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName == "State")
      {
        this.loadState();
        this._modalService.open(this.txtElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "Street")
      {
        this.loadStreet();
        this._modalService.open(this.txtElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "Occupancy")
      {
        this.loadOccupancyValues();
        this._modalService.open(this.occElement, { ariaLabelledBy: 'modal-basic-title'});
        
      }

      if (colName === "Occupancy Input")
      {
        this.FieldInput = this._selectedRowData.occupancyOrig;
        this.SameValCtr = 0;
        this.SelectedTxt = "";
        document.getElementById("occOptions").style.width = "380px";
        this.loadOccupancyValues();
        
        //this._modalService.open(this.occInputElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "Building Class")
      {
        this.loadBuildingValues();
        //this._modalService.open(this.occInputElement, { ariaLabelledBy: 'modal-basic-title'});
     
        this._modalService.open(this.buildingElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "Building Input")
      {
        
        this.SameValCtr = 0;
        this.SelectedTxt = "";
        document.getElementById("buildingOptions").style.width = "380px";
        this.loadBuildingValues();
        //this._modalService.open(this.buildingInputElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "LocName")
      {
        this.loadLocName();
        this._modalService.open(this.txtElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "County")
      {
        this.loadCounty();
        this._modalService.open(this.txtElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "Country")
      {
        this.loadCountries();
        this._modalService.open(this.countryElement, { ariaLabelledBy: 'modal-basic-title'});
      }

      if (colName === "Sprinkler")
      {
        this.loadSprinkler();
        this._modalService.open(this.sprinklerElement, { ariaLabelledBy: 'modal-basic-title'});
      }
    }

    loadSprinkler()
    {
      if (this._selectedRowData.sprinkler)
      {
         // var find = this.Sprinklers.find(x=> x.sprinklerId == this._selectedRowData.sprinkler.sprinklerId);
          this.SelectedSprinklerId = this._selectedRowData.sprinkler.Id;
          this.SameValCtr = this.Locations.filter(x=> x.sprinklerInput == this._selectedRowData.sprinklerInput).length;
          
      }
      this.FieldInput = this._selectedRowData.sprinklerInput;
      this.ModalTitle = "Sprinkler";
      this._selectedCol = FieldTypes.Sprinkler;
    }

    loadCountries()
    {
      if (this._selectedRowData.address.country)
      {
        if (this._selectedRowData.address.country.length > 1)
        {
          var find = this.Countries.find(x=> x.isoCode == this._selectedRowData.address.country);
          this.SelectedCountryId = find.countryId;
          this.SameValCtr = this.Locations.filter(x=> x.address.country == this._selectedRowData.address.country).length;
       
        }
      }
      this.ModalTitle = "Country";
      this._selectedCol = FieldTypes.Country;
    }

    loadState()
    {
      if (this._selectedRowData.address.state)
      {
        if (this._selectedRowData.address.state.length > 1)
        {
          this.SelectedTxt = this._selectedRowData.address.state;
          this.SameValCtr = this.Locations.filter(x=> x.address.state == this._selectedRowData.address.state).length;
        }
      }
      this.ModalTitle = "State";
      this._selectedCol = FieldTypes.State;
    }

    loadStreet()
    {
      this.SelectedTxt = this._selectedRowData.address.streetName;
      this.SameValCtr = this.Locations.filter(x=> x.address.streetName == this._selectedRowData.address.streetName).length;
      this.ModalTitle = "Street Name";
      this._selectedCol = FieldTypes.Street;
    }

    loadLocName()
    {
      this.SelectedTxt = this._selectedRowData.locName;
      this.SameValCtr = this.Locations.filter(x=> x.locName == this._selectedRowData.locName).length;
      this.ModalTitle = "Loc Name";
      this._selectedCol = FieldTypes.LocName;
    }
    
    loadCounty()
    {
      this.SelectedTxt = this._selectedRowData.address.county;
      this.SameValCtr = this.Locations.filter(x=> x.address.county == this.SelectedTxt).length;
      this.ModalTitle = "County";
      this._selectedCol = FieldTypes.County;
    }

    LoadStateValues(selectedState : string)
    {
      if (selectedState != null)
      {
       var selected = this.States.find(x=> x.code == selectedState);
      
       this.SelectedStateId = selected.id;

       var filtered  = this.Locations.filter(x=> x.address.stateCode !== null && x.address.stateCode.id == this.SelectedStateId);

       this.SameValCtr = filtered.length;
     
      }
    }

    loadOccupancyValues()
    {
      this.OccupancyCopies = [];
      this.Occupancies.forEach(x=>
      {
        this.OccupancyCopies.push(x);
      });

      var selected = this.Occupancies.find(x=> x.id == this._selectedRowData.occupancyType.id);

      this.SelectedOccupancyTypeId = this._selectedRowData.occupancyType.id;

      this.SameValCtr = this.Locations.filter(x=> x.occupancyOrig == this._selectedRowData.occupancyOrig).length;

      this.LocsWithNoOccupancyCtr = this.Locations.filter(x=> x.occupancyType.code == 0).length;
      
      this._selectedCol = FieldTypes.Occupancy;
      this.FieldInput = this._selectedRowData.occupancyOrig;
      if (selected.id == 1)
      {
        this.IsUnknown = true;
      }
    }

    loadBuildingValues()
    {
      this.BuildingClassCopies = [];
      this.BuildingClass.forEach(x=>
      {
        this.BuildingClassCopies.push(x);
      });

      var selected = this.BuildingClassCopies.find(x=> x.id == this._selectedRowData.bldgClass.id);
      this.SelectedBuildingId = selected.id;

      this.SameValCtr = this.Locations.filter(x=> x.buildingOrig == this._selectedRowData.buildingOrig).length;
      
      this.FieldInput = this._selectedRowData.buildingOrig;

      this._selectedCol = FieldTypes.BuildingClass;
    }

    public CloseModal()
    {
      this.IsUnknown = false;
      this._modalService.dismissAll();
    }

    public SetStateFilter(state : string)
    {
      var stateFilter = {
        state: {
          filterType: 'text',
          type: 'equals',
          filter: state,
        }
      }

      this.Options.api.setFilterModel(stateFilter);     
      document.getElementById("morph-tab").className="nav-link";
      document.getElementById("morph").className = "tab-pane";
      document.getElementById("locations").className = "tab-pane";
      document.getElementById("locations-tab").className="nav-link";
      document.getElementById("mapping-tab").className="nav-link active";
      document.getElementById("mappings").className = "tab-pane active";
    }

    saveFilterModel() {
      var savedFilterModel = this._gridApi.getFilterModel();
      var keys = Object.keys(savedFilterModel);      
    }

    public async ApplyBuildingInputValue()
    {
      this._selectedCol = FieldTypes.BuildingInput;
      this.ApplyValue(true, false);
    }

    public async ApplyOccInputValue()
    {
      this._selectedCol = FieldTypes.OccupancyInput;
      this.ApplyValue(true, false);
    }

    public async ApplyValue(forAllLocations : boolean, forUnknown : boolean = false)
    {
      if (this._selectedCol == FieldTypes.Street)
      {
        await this.applyStreetName(forAllLocations);
      }

      if (this._selectedCol == FieldTypes.Country)
      {
        await this.applyCountry(forAllLocations);
      }

      if (this._selectedCol == FieldTypes.State)
        this.applyState(forAllLocations);
      
      if (this._selectedCol == FieldTypes.OccupancyInput)
        this.applyOccInput();

      if (this._selectedCol == FieldTypes.Occupancy)
        this.applyOcc(forAllLocations,forUnknown);
      
      if (this._selectedCol == FieldTypes.BuildingInput)
        this.applyBuildingInput();

      if (this._selectedCol == FieldTypes.BuildingClass)
        this.applyBuilding(forAllLocations);

        if (this._selectedCol == FieldTypes.County)
        this.applyCounty(forAllLocations);
      
      if (this._selectedCol == FieldTypes.LocName)
        this.applyLocName(forAllLocations, false);

      if (this._selectedCol == FieldTypes.CustomLocName)
      {
        this._selectedCol = FieldTypes.LocName;
        this.applyLocName(true, true);
      }

      if (this._selectedCol == FieldTypes.Sprinkler)
      {
        this._selectedCol = FieldTypes.Sprinkler;
        this.applySprinkler(forAllLocations, false);
      }
        
      this._modalService.dismissAll();
    }

    private async applyState(forAllLocations : boolean)
    {
      var locs : LocationDto[] = [];
      if (forAllLocations)
      {
        var filtered = this.Locations.filter(x=> x.address.state == this._selectedRowData.address.state);

        filtered.forEach(x=> 
          {
              locs.push(x);
          });
      }
      else
        locs.push(this._selectedRowData);

        //var fieldType = this.FieldType("STATE");
        var fieldType = FieldTypes.State;
        await this.applyCommon(locs, this.SelectedTxt, fieldType);
    }

    private async applyCountry(forAllLocation : boolean)
    {
      var locs : LocationDto[] = [];
      
      if (forAllLocation)
      {
        var find = this.Countries.find(x=> x.isoCode == this._selectedRowData.address.country);

        var filtered = this.Locations.filter(x=> x.address.country == this._selectedRowData.address.country);
      
        var find = this.Countries.find(x=> x.countryId == this.SelectedCountryId);
        filtered.forEach(x=> 
        {
            x.address.country = find.isoCode;
            locs.push(x);
        });
      }
      else
        locs.push(this._selectedRowData);
        var find = this.Countries.find(x=> x.countryId == this.SelectedCountryId);

        await this.applyCommon(locs, find.isoCode, FieldTypes.Country);
    }

    private async applyStreetName(forAllLocations : boolean)
    {
      var locs : LocationDto[] = [];

      if (forAllLocations)
      {
        var filtered = this.Locations.filter(x=> x.address.streetName == this._selectedRowData.address.streetName);

        filtered.forEach(x=> 
        {
            locs.push(x);
        });
      }
      else
        locs.push(this._selectedRowData);
      
      //var fieldType = this.FieldType("STREET");
      var fieldType = FieldTypes.Street;
      await this.applyCommon(locs, this.SelectedTxt, fieldType);
    }

    private async applyCounty(forAllLocations : boolean)
    {
      var locs : LocationDto[] = [];

      if (forAllLocations)
      {
        var filtered = this.Locations.filter(x=> x.address.county == this._selectedRowData.address.county);

        filtered.forEach(x=> 
        {
            locs.push(x);
        });
      }
      else
        locs.push(this._selectedRowData);
      
      var fieldType = FieldTypes.County;

      await this.applyCommon(locs, this.SelectedTxt, fieldType);
    }

    private async applyLocName(forAllLocations : boolean, applyToAll : boolean = false)
    {
      var locs : LocationDto[] = [];

      if (forAllLocations ){

        var filtered : LocationDto[];

        if (applyToAll)
          filtered = this.Locations;
        else
          filtered = this.Locations.filter(x=> x.locName == this._selectedRowData.locName);

        filtered.forEach(x=> 
        {
            locs.push(x);
        });
      }
      else
        locs.push(this._selectedRowData);

        var fieldType = this._selectedCol;
        await this.applyCommon(locs, this.SelectedTxt, fieldType);
    }

    public async ApplyStateCode(forAllLocations : boolean)
    {
      var locs : LocationDto[] = [];
      
      var stateCodeDto = this.States.find(x=> x.id == this.SelectedStateId);
  
      if (forAllLocations)
      {
        var filtered  = this.Locations.filter(x=> x.address.stateCode.id == this._selectedRowData.address.stateCode.id);

        filtered.forEach(x=> 
        {
            x.address.stateCode = stateCodeDto;
            locs.push(x);
        });
      }
      else{
        this._selectedRowData.address.stateCode = stateCodeDto;
        locs.push(this._selectedRowData);
      }
      var fieldType = FieldTypes.StCode;

      await this.applyCommon(locs, stateCodeDto.code, fieldType);
    }

    private async applySprinkler(forAllLocations : boolean, applyToAll : boolean = false)
    {
      var locs : LocationDto[] = [];
      //did i break this code
      var sprinklerDto = this.Sprinklers.find(x=> x.Id == this.SelectedSprinklerId);
  
      if (forAllLocations)
      {
        var filtered  = this.Locations.filter(x=> x.sprinklerInput == this._selectedRowData.sprinklerInput);

        filtered.forEach(x=> 
        {
            x.sprinkler = sprinklerDto;
            locs.push(x);
        });
      }
      else{
        this._selectedRowData.sprinkler = sprinklerDto;
        locs.push(this._selectedRowData);
      }
      var fieldType = FieldTypes.Sprinkler;

      await this.applyCommon(locs, sprinklerDto.Id.toString(), fieldType);
    }

    public Reconcile()
    {
      var alreadyReconciled = this.Locations.filter(x=> !this._reconciled.includes(x));
      var locs = alreadyReconciled.filter(x=> x.reconciled == true);
      this.applyCommon(locs, "true", FieldTypes.Reconcile, false);

      var defaultFilter = {
        reconciled: {
          filterType: 'text',
          type: 'equals',
          filter: 'false',
        }
      };

      this.Options.api.setFilterModel(null);
      this.Options.api.setFilterModel(defaultFilter);

      locs.forEach(x=>
      {
          this._reconciled.push(x);
      });

      this.HasReconciled = false;
    }

    private async applyCommon(locs : LocationDto[], val : string, fieldType : FieldTypes, addToLoadVals : boolean = false)
    {

      this._messagingService.LoadingMsg(true);
      var conversion = this._conversionService.Get();

      var response = await this._locationBl.UpdateLocations(conversion.convId, locs, val, fieldType, addToLoadVals, this.SummaryDto);

      if (response.status)
      {
  
        this.ReconcileComplete = response.reconciled;
        debugger;
        this.initSummary(response.summary);
        this.agGrid_UpdateLocs(response.locations);
      }

      this._messagingService.LoadingMsg(false);
        
    }
    
   onBuildingTxtChanged()
   {
    this.Apply = false;

    if (!this.SelectedTxt)
    {
      return;
    }

    this.SameValCtr = this.Locations.filter(x=> x.buildingOrig && x.buildingOrig.toLowerCase().includes(this.SelectedTxt)).length;
    this.filterInput(2);
    this.Apply = true;
   }

   onOccTxtChanged()
   {
    this.Apply = false;
   
    if (!this.SelectedTxt)
    {
      return;
    }

    this.SameValCtr = this.Locations.filter(x=> x.occupancyOrig && x.occupancyOrig.toLowerCase().includes(this.SelectedTxt)).length;
    this.filterInput(1);
    this.Apply = true;
   } 
   onTxtChanged()
   {
     this.Apply = false;

     if (this._selectedCol == FieldTypes.Street)
     {
      if (this._selectedRowData.address.streetName != this.SelectedTxt)
        this.Apply = true;
     }

     if (this._selectedCol == FieldTypes.State)
     {
      if (this._selectedRowData.address.state != this.SelectedTxt)
        this.Apply = true;
     }

     if (this._selectedCol == FieldTypes.LocName)
     {
      if (this._selectedRowData.locName != this.SelectedTxt)
        this.Apply = true;
     }

     if (this._selectedCol == FieldTypes.County)
     {
      if (this._selectedRowData.address.county != this.SelectedTxt)
        this.Apply = true;
     }

     if (this._selectedCol == FieldTypes.CustomLocName)
      this.Apply = true;
   }

  onStateChange()
  {
    if (this._selectedRowData.address.stateCode == null && this.SelectedStateId)
    {
      this.Apply = true;
      return;
    }
    if (this._selectedRowData.address.stateCode.id != this.SelectedStateId)
      this.Apply = true;
      else
      this.Apply = false;
  }

    onCountryChange()
    {
      var country = this.Countries.find(x=> x.countryId == this.SelectedCountryId);

      if (this._selectedRowData.address.country == null && this.SelectedCountryId)
      {
        this.Apply = true;
        return;
      }
      if (this._selectedRowData.address.country != country.isoCode)
        this.Apply = true;
      else
        this.Apply = false;
    }

    onSprinklerChange()
    {
      var sprinkler = this.Sprinklers.find(x=> x.Id == this.SelectedSprinklerId);

      if (this.SelectedSprinklerId)
      {
        this.Apply = true;
        return;
      }
      if (this._selectedRowData.sprinkler.Id != sprinkler.Id)
        this.Apply = true;
      else
        this.Apply = false;
    }

    onBuildingChange()
    {
      if (!this.SelectedBuildingId)
      {
        this.Apply = false;
        return;
      }

      if (this._selectedRowData.bldgClass.id == this.SelectedBuildingId)
        this.Apply = false;
      else
        this.Apply = true;
    }

    onOccChange()
    {
      if (!this.SelectedOccupancyTypeId)
      {
        this.Apply = false
        return;
      }
      if (this._selectedRowData.occupancyType.id == this.SelectedOccupancyTypeId)
        this.Apply = false;
      else
        this.Apply = true;
    }

    onUnknownChanged(txt : string, type : number)
    {
      if (txt)
      {
        this.SummaryDto.type = type;
      }
      else{
        this.SummaryDto.type = 0;
      }
    }

    onRatingChanged(txt : string, type : number)
    {
      if (txt)
      {
        if (type ==1){
          this.SummaryDto.selectedOccupancyRating = txt;
          
          this.SummaryDto.ratingType = 1;
        }
          else{
            this.SummaryDto.selectedBuildingRating = txt;
            this.SummaryDto.ratingType = 2;
          }
      }
      else{
        this.SummaryDto.ratingType = 0;
      }
    }

    onDisChanged(txt : string, type : number)
    {
      if (txt)
      {
        this.SummaryDto.distinctInputs.disType = type;
      }
      else{
        this.SummaryDto.distinctInputs.disType = 0;
      }
    }

    filterDisabled() : boolean
    {
        return this.SummaryDto.type == 0;
    }

    distinctFilterDisabled() : boolean
    {
        return this.SummaryDto.distinctInputs.disType == 0;
    }

    ratingFilterDisabled() : boolean
    {
        return this.SummaryDto.ratingType == 0;
    }

    ratingFilter()
    {
      var selected : FilterDto;
      var ratingFilter : any;
  
      switch (this.SummaryDto.ratingType)
      {
        case 1 :
          var t = this.SummaryDto.selectedOccupancyRating;
          var rating: number = +t;
          rating = rating / 100;
       
          ratingFilter = {
            occupancyScore: {
              filterType : 'number',
              type: 'lessThanOrEqual',
              filter: rating
            }
          };
          break;
        case 2 :
          var t = this.SummaryDto.selectedBuildingRating;
          var rating: number = +t;
          rating = rating / 100;
          ratingFilter = {
            buildingScore: {
              filterType: 'number',
              type: 'lessThanOrEqual',
              filter: rating
            }
          };
          break;
      }

      this.Options.api.setFilterModel(null);
      this.Options.api.setFilterModel(ratingFilter);
      this.CloseModal();
    }

    distinctFilter()
    {
 
      var selected : FilterDto;
      var unknownFilter : any;
      switch (this.SummaryDto.distinctInputs.disType)
      {
        case 1 :
          selected = this.SummaryDto.distinctInputs.occupancy.find(x=> x.text == this.SummaryDto.distinctInputs.selectedDisOccupancy);
          unknownFilter = {
            occupancyOrig: {
              filterType: 'text',
              type: 'contains',
              filter: selected.text
            }
          };
          break;
        case 2 :
          selected = this.SummaryDto.distinctInputs.building.find(x=> x.text == this.SummaryDto.distinctInputs.selectedDisBuilding);
          unknownFilter = {
            buildingOrig: {
              filterType: 'text',
              type: 'contains',
              filter: selected.text
            }
          };
          break;
        case 3 :
          selected = this.SummaryDto.distinctInputs.sprinkler.find(x=> x.text == this.SummaryDto.distinctInputs.selectedDisSprinkler);
          unknownFilter = {
            sprinklerInput: {
              filterType: 'text',
              type: 'contains',
              filter: selected.text
            }

          };
          break;
      }
      this.Options.api.setFilterModel(null);
      this.Options.api.setFilterModel(unknownFilter);
      this.CloseModal();
    }

    filter()
    {
      var selected : UnknownDto;

      var unknownFilter : any;
      switch (this.SummaryDto.type)
      {
        case 1 :
          selected = this.SummaryDto.occupancy.find(x=> x.text == this.SummaryDto.selectedOccupancy);
          unknownFilter = {
            occupancyOrig: {
              filterType: 'text',
              type: 'contains',
              filter: selected.text,
            }
          };
          break;
        case 2 :
          selected = this.SummaryDto.buildingClass.find(x=> x.text == this.SummaryDto.selectedBuilding);
          unknownFilter = {
            buildingOrig: {
              filterType: 'text',
              type: 'contains',
              filter: selected.text,
            }
          };
          break;
        case 3 :
          selected = this.SummaryDto.sprinkler.find(x=> x.text == this.SummaryDto.selectedSprinkler);
          unknownFilter = {
            sprinklerInput: {
              filterType: 'text',
              type: 'contains',
              filter: selected.text,
            }

          };
          break;
      }
      this.Options.api.setFilterModel(null);
      this.Options.api.setFilterModel(unknownFilter);
      this.CloseModal();
      
      
    }

    filterInput(type : number)
    {

      var origFilter : any;
      switch (type)
      {
        case 1 :
          origFilter = {
            occupancyOrig: {
              filterType: 'text',
              type: 'contains',
              filter: this.SelectedTxt,
            }
          };
          break;
        case 2 :
          origFilter = {
            buildingOrig: {
              filterType: 'text',
              type: 'contains',
              filter: this.SelectedTxt,
            }
          };
          break;
      }
      this.Options.api.setFilterModel(null);
      this.Options.api.setFilterModel(origFilter);
      //this.CloseModal();
    }

    onFirstDataRendered()
    {
      this._reconciled = this.Locations.filter(x=> x.reconciled);

     this.resetFilters();
    }

    resetFilters()
    {
      var defaultFilter = {
        reconciled: {
          filterType: 'text',
          type: 'equals',
          filter: 'false',
        }
      };

      this.Options.api.setFilterModel(null);
      this.Options.api.setFilterModel(defaultFilter);
    }

    onGridReady(params) {
      
      this._gridApi = params.api;
      this._gridColumnApi = params.columnApi;

      //params.api.setDomLayout('autoHeight');
      this.resizeColumns();
    }

  

private initGrid()
{
  this.Options = <GridOptions>{
  
    getRowStyle: (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return {background: '#e7e7e7'};
      }
    },
    pagination: true,
    paginationPageSize: 50,
    cacheBlockSize: 50
  };
}

private resizeColumns()
{
  if (this._gridApi == null)
  {
    return;
  }
  var allColumnIds = [];
  this._gridColumnApi.getAllColumns().forEach(function(column) {
    allColumnIds.push(column.colId);
  });
  this._gridColumnApi.autoSizeColumns(allColumnIds, false);
}
 
  async Export()
  {
    this._messagingService.LoadingMsg(true);
    this.ParsingHeader = "Exporting Conversion";
    this.ParsingStarted = true;
    this.ProgressPercent = "0%";
    this.ProgressTxt= "0% Exported";

    this._modalService.open(this.loadElement, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false});
    //in here we must open the popup
    let progressTimer = timer(6000, 6000);

   

    var conversion = this._conversionService.Get();

    var exportResponse = await this._locationBl.Export(conversion.convId);

    if (exportResponse.status)
      this.Download(conversion);

   
    this._modalService.dismissAll();

    this._messagingService.LoadingMsg(false);
  }

  private Download(conversion : ConversionDto)
  {
      this._managerBl.Download(conversion);
  }

  SetClickedRow = function(index){
    this.SelectedRow = index;
  }


  async GetMapped()
  {

    this._messagingService.LoadingMsg(true);

    var conversion = this._conversionService.Get();

    this.ParsingHeader = "Retrieving Locations";
    this.ParsingStarted = true;
    this.ProgressPercent = "0%";
    this.ProgressTxt= "0% of Locations Mapped";

    this._modalService.open(this.loadElement, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false});
    this.HasLoaded = false;

    var getMappedConversionResponse = await this._locationBl.GetMapped(conversion.convId);

    if (!getMappedConversionResponse.status) //error occured
    {
      this._messagingService.LoadingMsg(false);
      this._modalService.dismissAll();
      return;
    }

    this.HasCompleted = true;
    this._messagingService.LoadingMsg(false);

    //retrieved successfully
    this.CountryTxt = getMappedConversionResponse.country;
    conversion.assumptions = getMappedConversionResponse.assumptions;
    this.Assumptions = getMappedConversionResponse.assumptions;
    this.Confidence = getMappedConversionResponse.confidence;
    conversion.hasLocations = true;
    this._conversionService.Set(conversion);
  
    this.Locations = [];
    this.Locations = await this._locationBl.Get2(conversion.convId, getMappedConversionResponse.rowCount);

 
    this.TotalTiv = 0;
    this.Locations.forEach(tp=>
    {
      this.TotalTiv += tp.totalTiv;
    })

    this.TotalTiv = Math.round(this.TotalTiv);

    var summaryResponse = this._managerBl.GetSummary(conversion.convId).then(x=>
    {
     this.initSummary(x.summary);
     this.HasLoaded = true;
    });
  
    this._modalService.dismissAll();
  }
  async Load()
  {
    var conversion = this._conversionService.Get();

    var hasLocations = conversion.hasLocations;

    if (hasLocations)
    {
      await this.GetMapped();
      return;
    }

    this._messagingService.LoadingMsg(true);
    this.ParsingHeader = "Mapping Locations";
    this.ParsingStarted = true;
    this.ProgressPercent = "0%";
    this.ProgressTxt= "0% of Locations mapped";
    this._modalService.open(this.loadElement, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false});
    //in here we must open the popup
    this.HasLoaded = false;
    //let progressTimer = timer(5000, 5000);

    //this._progSub = progressTimer.subscribe(() => {
      ////call api to
     // var obs = this._locationBl.GetProgress(conversion.convId, 1);

     // obs.subscribe(x => {
      //  this.ParsingStarted = true;
     //   this.ParsingHeader = x.title;
     //   this.ProgressPercent = x.percentageText;
     //  this.ProgressTxt = x.percentageText + '%  - ' + x.completeText;
     // });

    //});

 
    var mapLocationsResponse = await this._locationBl.MapLocations(conversion.convId);

    if (!mapLocationsResponse.status)
    {
      this._messagingService.LoadingMsg(false);
      this._modalService.dismissAll();
      return;
    }
   
    //this.CountryTxt = mapLocationsResponse.country;
  
    //var tempLocs: LocationDto[] = [];
    //conversion.assumptions = mapLocationsResponse.assumptions;
    //this.Assumptions = conversion.assumptions;
    //this.CommonOccupancies = mapLocationsResponse.commonOccupancies;
    //this.Confidence = mapLocationsResponse.confidence;

//    this._conversionService.Set(conversion);
  //  this.Locations = [];

    //this.Locations = await this._locationBl.Get2(conversion.convId, mapLocationsResponse.rowCount);

    //this.TotalTiv = 0;
    //this.Locations.forEach(tp=>
    //{
     // this.TotalTiv += tp.totalTiv;
    //})

    //this.TotalTiv = Math.round(this.TotalTiv);

  //ignore this stuff it was alreadyu commented out
   //// var t = this._locationBl.Get(conversion.convId, mapLocationsResponse.rowCount).subscribe(locationVals=>
    //  {
      //  locationVals.forEach(async locArr=>
      //    {
        //    locArr.forEach(x=>
        //    {
         //     tempLocs.push(x);            
         //   });

          //  this.Locations = tempLocs;
         //   this.TotalTiv = 0;
          //  tempLocs.forEach(tp=>
          //  {
          //    this.TotalTiv += tp.totalTiv;
          //  })

          //  this.TotalTiv = Math.round(this.TotalTiv);

            
         // });


         //we will need this summary part
  //  var summaryResponse = this._managerBl.GetSummary(conversion.convId).then(x=>
   // {
     // this.initSummary(x.summary);
      //this.HasLoaded = true;
           
    //});
    //this._progSub.unsubscribe();
    //this._modalService.dismissAll();
          
    //this._locationBl.DeleteProgress(conversion.convId, 1);
  this._messagingService.LoadingMsg(false);
  } 

  private initSummary(summaryDto : SummaryDto)
  {
    var summaryCtr = summaryDto.count;

    this.SummaryBtn = "Filters - " + summaryCtr.toString();
    this.SummaryDto = summaryDto;
  }

  private async applyBuilding(forAllLocations : boolean)
  {
    var addToLoadVals : boolean = true;
    var fieldType = FieldTypes.BuildingClass;

    var locs : LocationDto[];

    if (forAllLocations)
        locs = this.Locations.filter(x=> x.buildingOrig == this._selectedRowData.buildingOrig);
    else
      locs = this.Locations.filter(x=> x.locId == this._selectedRowData.locId);
    
    var fieldType = this._selectedCol;

    await this.applyCommon(locs, this.SelectedBuildingId.toString(), fieldType, addToLoadVals);
  }

  private async applyBuildingInput()
  {
    var addToLoadVals : boolean = false;
    var locs : LocationDto[];
    locs = this.Locations.filter(x=> x.buildingOrig && x.buildingOrig.toLowerCase().includes(this.SelectedTxt));
    
    addToLoadVals = true;

    var fieldType = FieldTypes.BuildingClass;

    await this.applyCommon(locs, this.SelectedBuildingId.toString(), fieldType, addToLoadVals);

    this.resetFilters();
  }

  public ModalBuildingClose()
  {
    this.resetFilters();
    this.CloseModal();
  }

  public ModalOccupancyClose()
  {
    this.resetFilters();
    this.CloseModal();
  }
  private async applyOccInput()
  {
    var addToLoadVals : boolean = false;
    var fieldType = FieldTypes.OccupancyInput;

    var locs : LocationDto[];

    locs = this.Locations.filter(x=> x.occupancyOrig && x.occupancyOrig.toLowerCase().includes(this.SelectedTxt));
    
    addToLoadVals = true;

    var fieldType = FieldTypes.Occupancy;

    await this.applyCommon(locs, this.SelectedOccupancyTypeId.toString(), fieldType, addToLoadVals);

    this.resetFilters();
  }

  private async applyOcc(forAllLocations : boolean, forUnknown : boolean)
  {
    var addToLoadVals : boolean = false;
    var fieldType = FieldTypes.Occupancy;

    debugger;
    var locs : LocationDto[];
    if (forUnknown == true && forAllLocations == false)
    {
      locs = this.Locations.filter(x=> x.occupancyType.code == 0);

      if (locs.length == 0)
        this._toastr.show("There are 0 locations with an unknown occupancy", "Common Occupancy Not applied to any Location records", { positionClass: 'toast-top-full-width',titleClass: "custom-title-blue"});
    }

    if (forUnknown == false && forAllLocations == true)
    {
      locs = this.Locations.filter(x=> x.occupancyOrig == this._selectedRowData.occupancyOrig);
      addToLoadVals = true;
    }

    if (forUnknown == false && forAllLocations == false)
    {
      locs = this.Locations.filter(x=> x.locId == this._selectedRowData.locId);
      addToLoadVals = true;
    }
      

    var fieldType = this._selectedCol;

    await this.applyCommon(locs, this.SelectedOccupancyTypeId.toString(), fieldType, addToLoadVals);
    this.IsUnknown = false;
  }

  agGrid_UpdateLocs(locations : LocationDto[])
  {
   
      locations.forEach(loc=>
        {
          var rowNode = this._gridApi.getRowNode(loc.uniqueId - 1)

          rowNode.setData(loc);
          this._gridApi.flashCells({
            rowNodes: [rowNode]
          });
        });
  }

  private Checked()
  {
    var alreadyReconciled = this.Locations.filter(x=> !this._reconciled.includes(x));
    var locs = alreadyReconciled.filter(x=> x.reconciled == true);

    if (locs.length > 0)
    {
      this.HasReconciled = true;
      return;
    }
    this.HasReconciled = false;

  }

  private onSelectionChanged(params)
  {
  
    this.HasReconciled = false;
    var ctr = 0;
    this.Locations.forEach(loc=>
      {
        var rowNode = this._gridApi.getRowNode(loc.uniqueId - 1)
        
        if (rowNode.data.reconciled == true)
        {
          ctr++;
        }
      });

      if (ctr > 0)
      {
        this.HasReconciled = true;
      }
  }


  async ngAfterViewInit() {

    var conversion = this._conversionService.Get();
    if (conversion.convId === -99)
      this._router.navigate(['/manager']);
  }

  CloseOccupancy()
  {
    document.getElementById("occOptions").style.width = "0";
  }
  CloseBuilding()
  {
    document.getElementById("buildingOptions").style.width = "0";
  }

}
