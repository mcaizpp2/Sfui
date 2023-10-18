import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { BtnRenderComponent } from 'src/app/AgGrid/btn-render/btn-render.component';
import { AdminValuesBl } from 'src/app/Bl/admin-values-bl';
import { SprinklerTypeDto } from 'src/app/Models/Dtos/LkpSprinkler';
import { SprinklerDto, SprinklerValsDto } from 'src/app/Models/Dtos/sprinkler-dto';
import { ValDto } from 'src/app/Models/Dtos/state-dto';
import { ValueTypeEnum } from 'src/app/Models/Enums/value-type-enum';
import { MessageService } from 'src/app/Services/message-service';

@Component({
  selector: 'app-changed-values',
  templateUrl: './changed-values.component.html',
  styleUrls: ['./changed-values.component.css']
})
export class ChangedValuesComponent implements OnInit {

  @ViewChild('confirmSprinklerTemplate',{static: true}) confirmSprinklerElement : TemplateRef<any>;
  
  @ViewChild('confirmSprinklerCommitTemplate',{static: true}) confirmSprinklerCommitElement : TemplateRef<any>;
  

  @ViewChild('confirmValuesCommitTemplate',{static: true}) confirmValuesCommitElement : TemplateRef<any>;
  @ViewChild('confirmValuesTemplate',{static: true}) confirmValuesElement : TemplateRef<any>;

  @ViewChild('sprinklerTemplate',{static: true}) sprinklerElement : TemplateRef<any>;

  @ViewChild('valueTemplate',{static: true}) valueElement : TemplateRef<any>;

  public SprinklerValues : SprinklerValsDto[];
  public SelectedSprinkler : SprinklerValsDto;
  public SelectedValue : ValDto;
  public StateValues : ValDto[];
  public StreetValues : ValDto[];
  public SprinklerOptions:GridOptions;
  public StreetOptions:GridOptions;
  public StateOptions:GridOptions;
  private _gridApi;
  private _streetGridApi;
  private _stateGridApi;
  private _selectedValuesId : number;
  public SprinklerTypes: SprinklerTypeDto[];
  public ValueType : ValueTypeEnum;
  public RowSelection : string = 'single';

  public SprinklerColumnDefs = [
    {
      headerName: 'Text', field: 'text', width:250, headerClass:'ag-custom-header' 
    },
    { headerName: 'Sprinkler Type', field: 'sprinklerValue.value' , width:110,headerClass:'ag-custom-header',
    resizable: true 
    },
    {headerName: '', field: 'sprinklerValsId', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedSprinkler = data;
        this.ConfirmSprinklerCommit();
      }.bind(this),
      label: 'Commit'
    }},
    {headerName: '', field: 'sprinklerValsId', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedSprinkler = data;
        this.UpdateSprinkler();
      }.bind(this),
      label: 'Update'
    }},
    {headerName: '', field: 'sprinklerValsId', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedSprinkler = data;
        this.ConfirmSprinklerDelete();
      }.bind(this),
      label: 'Delete'
    }},
  ];

  public StateColumnDefs = [
    {
      headerName: 'When Found', field: 'originalValue', width:250, headerClass:'ag-custom-header' 
    },
    { headerName: 'Replace With', field: 'replacementValue' , width:250,headerClass:'ag-custom-header',
    resizable: true 
    },
    {headerName: '', field: 'id', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedValue = data;
        this.ConfirmValuesCommit(ValueTypeEnum.State);
      }.bind(this),
      label: 'Commit'
    }},
    {headerName: '', field: 'id', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedValue = data;
        this.UpdateValue(ValueTypeEnum.State);
      }.bind(this),
      label: 'Update'
    }},
    {headerName: '', field: 'id', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this._selectedValuesId = data.id;
        this.ConfirmValuesDelete(ValueTypeEnum.State);
      }.bind(this),
      label: 'Delete'
    }}
  ];

  public StreetColumnDefs = [
    {
      headerName: 'When Found', field: 'originalValue', width:250, headerClass:'ag-custom-header' 
    },
    { headerName: 'Replace With', field: 'replacementValue' , width:250,headerClass:'ag-custom-header',
    resizable: true 
    },
    {headerName: '', field: 'id', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedValue = data;
        this.ConfirmValuesCommit(ValueTypeEnum.Street);
      }.bind(this),
      label: 'Commit'
    }},
    {headerName: '', field: 'id', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.SelectedValue = data;
        this.UpdateValue(ValueTypeEnum.Street);
      }.bind(this),
      label: 'Update'
    }},
    {headerName: '', field: 'id', width:110, headerClass:'ag-custom-header', 
    resizable: true, cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this._selectedValuesId = data.id;
        this.ConfirmValuesDelete(ValueTypeEnum.Street);
      }.bind(this),
      label: 'Delete'
    }}  
  ];

  constructor(private _adminValuesBl : AdminValuesBl,private _modalService: NgbModal,
    private _messagingService : MessageService) { }

  async ngOnInit() {
    this._messagingService.LoadingMsg(true);
    this.SprinklerTypes = [];

    var unknown = new SprinklerTypeDto({ id:0, text:"Unknown"});
    var yes = new SprinklerTypeDto({ id:1, text:"Yes"});
    var no = new SprinklerTypeDto({ id:2, text:"No"});
    this.SprinklerTypes.push(unknown);
    this.SprinklerTypes.push(yes);
    this.SprinklerTypes.push(no);

    this.SprinklerOptions = <GridOptions>{
   
      getRowStyle: (params) => {
        if (params.node.rowIndex % 2 === 0) {
          return {background: '#e7e7e7'};
        }
      }
    }

    this.StateOptions = <GridOptions>{
   
      getRowStyle: (params) => {
        if (params.node.rowIndex % 2 === 0) {
          return {background: '#e7e7e7'};
        }
      }
    }

    this.StreetOptions = <GridOptions>{
   
      getRowStyle: (params) => {
        if (params.node.rowIndex % 2 === 0) {
          return {background: '#e7e7e7'};
        }
      }
    }

    var response = await this._adminValuesBl.Get();
    this.SprinklerValues = response.sprinklerValues;
    this.StateValues = response.stateValues;
    this.StreetValues = response.streetValues;

    this._messagingService.LoadingMsg(false);
  }

  onSprinklerGridReady(params) {
    this._gridApi = params.api;
    this._gridApi.setDomLayout('autoHeight');
  }

  onStateGridReady(params) {

    this._stateGridApi = params.api;
    this._stateGridApi.setDomLayout('autoHeight');
  }

  onStreetGridReady(params) {

    this._streetGridApi = params.api;
    this._streetGridApi.setDomLayout('autoHeight');
  }

  Cancel()
  {
    this._modalService.dismissAll();
  }

  async CommitValues()
  {
    this._messagingService.LoadingMsg(true);

    var response = await this._adminValuesBl.CommitValue(this.SelectedValue.id, this.ValueType);

    if (this.ValueType == ValueTypeEnum.State)
      this.AgStateCommit();

    if (this.ValueType == ValueTypeEnum.Street)
    {
      this.AgStreetCommit();
    }
    this._messagingService.LoadingMsg(false);
    this._modalService.dismissAll();

  }

  private AgStateCommit()
  {
    this._stateGridApi.forEachNode((rowNode, index) => {
      if (rowNode.data.id == this.SelectedValue.id)
      {
        rowNode.data.state = true;

        var selectedState = this.StateValues.find(x=> x.id == this.SelectedValue.id);
        selectedState.state = true;

        this._stateGridApi.setRowData(this.StateValues);
      }
      
    });
  }

  private AgStreetCommit()
  {
    this._stateGridApi.forEachNode((rowNode, index) => {
      if (rowNode.data.id == this.SelectedValue.id)
      {
        rowNode.data.state = true;

        var selectedState = this.StreetValues.find(x=> x.id == this.SelectedValue.id);
        selectedState.state = true;

        this._streetGridApi.setRowData(this.StreetValues);
      }
      
    });
  }

  async SprinklerCommit()
  {
    this._messagingService.LoadingMsg(true);
    var response = await this._adminValuesBl.CommitSprinkler(this.SelectedSprinkler);

    this._messagingService.LoadingMsg(false);
    this._modalService.dismissAll();
  }

  async ConfirmSprinkler()
  {
    this._messagingService.LoadingMsg(true);
    var response = await this._adminValuesBl.DeleteSprinkler(this.SelectedSprinkler);
    this._messagingService.LoadingMsg(false);
    this._gridApi.forEachNode((rowNode, index) => {
      if (rowNode.data.id == this._selectedValuesId)
      {
        this.SprinklerValues.splice(index,1);

        this._gridApi.setRowData(this.SprinklerValues);
      }
      
    });
    this._modalService.dismissAll();
  }

  async ConfirmValues()
  {
    this._messagingService.LoadingMsg(true);

    if (this.ValueType == ValueTypeEnum.State)
    {
        this._stateGridApi.forEachNode((rowNode, index) => {
          if (rowNode.data.id == this._selectedValuesId)
          {
            this.StateValues.splice(index,1);

            this._stateGridApi.setRowData(this.StateValues);
          }
          
        });
    }

    if (this.ValueType == ValueTypeEnum.Street)
    {
      this._streetGridApi.forEachNode((rowNode, index) => {
        if (rowNode.data.id == this._selectedValuesId)
        {
          this.StreetValues.splice(index,1);

          this._streetGridApi.setRowData(this.StreetValues);
        }
      });
    }

    var response = await this._adminValuesBl.DeleteValue(this._selectedValuesId, this.ValueType);

    this._messagingService.LoadingMsg(false);
    this._modalService.dismissAll();
  }

  private ConfirmSprinklerCommit()
  {
    this._modalService.open(this.confirmSprinklerCommitElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private ConfirmSprinklerDelete()
  {
    this._modalService.open(this.confirmSprinklerElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private UpdateSprinkler()
  {
    this._modalService.open(this.sprinklerElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private UpdateValue(valueType : ValueTypeEnum)
  {
    this.ValueType = valueType;
    this._modalService.open(this.valueElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private ConfirmValuesCommit(valueType : ValueTypeEnum)
  {
    this.ValueType = valueType;
    this._modalService.open(this.confirmValuesCommitElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private ConfirmValuesDelete(valueType : ValueTypeEnum)
  {
    this.ValueType = valueType;
    this._modalService.open(this.confirmValuesElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private UpdateStreetAgGrid()
  {
    this._streetGridApi.forEachNode((rowNode, index) => {
      if (rowNode.data.id == this.SelectedValue.id)
      {
        var selectedStreet = this.StreetValues.find(x=> x.id == this.SelectedValue.id);
        selectedStreet.originalValue = this.SelectedValue.originalValue;
        selectedStreet.replacementValue = this.SelectedValue.replacementValue;
        this._streetGridApi.setRowData(this.StreetValues);
      }
    });
  }
  
  private UpdateStateAgGrid()
  {
    this._stateGridApi.forEachNode((rowNode, index) => {
      if (rowNode.data.id == this.SelectedValue.id)
      {
        var selectedState = this.StateValues.find(x=> x.id == this.SelectedValue.id);
        selectedState.originalValue = this.SelectedValue.originalValue;
        selectedState.replacementValue = this.SelectedValue.replacementValue;

        this._stateGridApi.setRowData(this.StateValues);
      }
    });
  }
  public async UpdateValueRecord()
  {
    this._messagingService.LoadingMsg(true);
   
    var response = await this._adminValuesBl.UpdateValue(this.SelectedValue, this.ValueType);

    if (this.ValueType == ValueTypeEnum.Street)
    {
      this.UpdateStreetAgGrid();
    }

    if (this.ValueType == ValueTypeEnum.State)
    {
      this.UpdateStateAgGrid();
    }
    this._modalService.dismissAll();
    this._messagingService.LoadingMsg(false);
  }

  
  public async UpdateSprinklerRecord()
  {
    this._messagingService.LoadingMsg(true);
    
    var response = await this._adminValuesBl.UpdateSprinkler(this.SelectedSprinkler)

    this._gridApi.forEachNode((rowNode, index) => {
      if (rowNode.data.sprinklerValsId == this.SelectedSprinkler.sprinklerValsId)
      {
        var selectedSprinkler = this.SprinklerValues.find(x=> x.sprinklerValsId == this.SelectedSprinkler.sprinklerValsId);
        selectedSprinkler.text = this.SelectedSprinkler.text;
        selectedSprinkler.sprinklerValue = this.SelectedSprinkler.sprinklerValue;

        this.SelectedSprinkler = null;
        this.SelectedSprinkler = selectedSprinkler;
        this._gridApi.setRowData(this.SprinklerValues);
      }
    });

    var res = await this._adminValuesBl.Get();
    this.SprinklerValues = res.sprinklerValues;
    this.StateValues = res.stateValues;
    this.StreetValues = res.streetValues;
    this._modalService.dismissAll();
    this._messagingService.LoadingMsg(false);
  }

}
