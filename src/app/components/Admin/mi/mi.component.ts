import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LookupBl } from '../../../Bl/lookup-bl';
import { LocationLookupsResponse } from '../../../Models/Response/location-lookups-response';
import { MaintenanceBl } from '../../../Bl/maintenance-bl';
import { GridOptions } from 'ag-grid-community';
import { LoadValsDto } from '../../../Models/Dtos/load-vals-dto';
import { FieldTypes } from '../../../Models/Enums/field-types';
import { AuthenticationService } from '../../../Data/authentication-service';
import { TestTerm } from '../../../Models/Dtos/test-term';
import { StageRequest } from '../../../Models/Requests/stage-request';
import { CommitRequest } from '../../../Models/Requests/commit-request';
import { MessageService } from '../../../Services/message-service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchedEnum } from 'src/app/Models/Enums/MatchedEnum';
import { BtnRenderComponent } from 'src/app/AgGrid/btn-render/btn-render.component';

@Component({
  selector: 'app-mi',
  templateUrl: './mi.component.html',
  styleUrls: ['./mi.component.css']
})
export class MiComponent implements OnInit {
  @ViewChild('termTemplate',{static: true}) termElement : TemplateRef<any>;
  @ViewChild('confirmTemplate',{static: true}) confirmElement : TemplateRef<any>;

  private _locationLookups : LocationLookupsResponse;
  public Options:GridOptions;
  public TestOptions:GridOptions;
  public HasLoaded : boolean;
  private _gridApi;
  private _testGridApi;
  public RowSelection : string = 'single';
  public LoadVals : LoadValsDto[];
  public GridSelected : LoadValsDto;
  public GridLoadValSelected : boolean;
  public TestTerms : TestTerm[];
  public ShowTestTerms : boolean;
  public TermForm: FormGroup;
  public ShowCommit : boolean;
  public rowClassRules;

  private _selectedLoadValToDelete : number;

  private _allTerms : TestTerm[];

  public ColumnDefs = [
    {
      headerName: 'Value', field: 'value', width:250, headerClass:'ag-custom-header',editable: true 
     
    },
    {headerName: 'Category', field: 'field' , width:100,headerClass:'ag-custom-header',resizable: true, valueGetter: function(params) {
    
      var types = FieldTypes;
      return types[params.data.field]}
    },
    {headerName: 'User Mapping', field: 'mapped' , width:250,headerClass:'ag-custom-header',resizable: true, valueGetter: function(params) {
    
      return params.data.mapped.scheme + ' - ' + params.data.mapped.code + ' - ' + params.data.mapped.name}
    },
    {headerName: '', field: 'loadValId', width:150, headerClass:'ag-custom-header', resizable: true,
    cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this.onCellClicked(data);
      }.bind(this),
      label: 'Add'
    }},
    {headerName: '', field: 'loadValId', width:150, headerClass:'ag-custom-header', resizable: true,
    cellRendererFramework: BtnRenderComponent,
    cellRendererParams: {
      onClick: function(data : any)
      {
        this._selectedLoadValToDelete = data.loadValId;
        this.ConfirmLoadValDelete();
      }.bind(this),
      label: 'Delete'
    }}
  ];

  private ConfirmLoadValDelete()
  {
    this._modalService.open(this.confirmElement , { ariaLabelledBy: 'modal-basic-title'});
  }

  public TestTermsColumnDefs = [
    {
      headerName: 'Term', field: 'terms', width:250, headerClass:'ag-custom-header'
    },
    {
      headerName: 'Answer', field: 'answer', width:350, headerClass:'ag-custom-header'
    },
    {
      headerName: 'Match Previous Test', field: 'matched', width:200, headerClass:'ag-custom-header',
    
       cellRenderer: function(params) { 

        let eIconGui = document.createElement('span');
        switch(params.data.matched) { 
          case MatchedEnum.True: { 
            eIconGui.innerHTML = '<em class="fa fa-check success"></em>';
             break; 
          } 
          case MatchedEnum.False: { 
            eIconGui.innerHTML = '<em class="fa fa-times failure"></em>'; 
             break; 
          } 
          default: { 
            eIconGui.innerHTML = '<em class="fa fa-exclamation-circle exclaim"></em>';  
             break; 
          } 
       } 
        return eIconGui;
     }, 
    },
  ];
 

  constructor(
    private _lookupBl : LookupBl,
    private _maintenanceBl : MaintenanceBl,
    private _authenticationService : AuthenticationService,
    private _messagingService : MessageService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal) { }

  ngOnInit() {
    
      this.LoadLookups();
      this.GetWords();

      this.Options = <GridOptions>{
   
        getRowStyle: (params) => {
          if (params.node.rowIndex % 2 === 0) {
            return {background: '#e7e7e7'};
          }
        }
      }

      this.rowClassRules = {
        'isAddedHighLight': function (params) {

          var isAdded = params.data.isAddedTerm;
          return isAdded == true;
        },
      };

      this.TestOptions = <GridOptions>{
   
        getRowStyle: (params) => {
          if (params.node.rowIndex % 2 === 0) {
            return {background: '#e7e7e7'};
          }
        }
      }

      this.TermForm = this._formBuilder.group({
        name: ['', Validators.required],
        buildingClass: [''],
        occupancy: ['']
      });
  }

  onSelectionChanged() {
    var selected = this._gridApi.getSelectedRows();

    if (selected)
    {
      this.GridSelected = selected[0];
      this.GridLoadValSelected = true;
    }

  }

  SaveTerm()
  {
    var fieldType = this.GridSelected.field;
    var termToAdd = this.TermForm.controls['name'].value;

    this.TestTerms.push({ testTermsId : 0,
      loadTypeId : fieldType,
      terms : termToAdd,
      matched : MatchedEnum.Na,
      answer : 'Not Run',
      isAddedTerm : false,
      answerId : 0
      });

    this._testGridApi.setRowData(this.TestTerms);
    
    this._modalService.dismissAll();
  }

  onGridReady(params) {
    this._gridApi = params.api;
    this._gridApi.setDomLayout('autoHeight');
  }

  onTestGridReady(params) {
    this._testGridApi = params.api;
    this._testGridApi.setDomLayout('autoHeight');
  }

  async AddTerm()
  {
    this._modalService.open(this.termElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  async Commit()
  {
    this._messagingService.LoadingMsg(true);

    var commitRequest = new CommitRequest({FieldType : this.GridSelected.field, 
      Load: this.GridSelected, 
      UserId : this._authenticationService.currentUserValue.userId,
      TestTerms : this.TestTerms});

    debugger;
    var response = await this._maintenanceBl.Commit(commitRequest);
    if (response.status)
    {
      this.ShowCommit = false;
      this.ShowTestTerms = false;
      await this.GetWords();
    }
    this._messagingService.LoadingMsg(false);
  }

  async Stage()
  {
    this._messagingService.LoadingMsg(true);
    var field : FieldTypes;
    var terms : TestTerm[] = [];
    if (this.GridSelected.field == FieldTypes.Occupancy)
    {
      field = FieldTypes.Occupancy;
    }
    else{
      field = FieldTypes.BuildingClass;
    }

    this.TestTerms.forEach(x=> 
    {
      terms.push(x);
    });

    var stageRequest = new StageRequest({FieldType : this.GridSelected.field, Terms: terms, 
      Load: this.GridSelected, 
      UserId : this._authenticationService.currentUserValue.userId});
    
    var response = await this._maintenanceBl.Stage(stageRequest);

    if (response.status)
    {
      response.terms.forEach(x=>
      {
        var term = this.TestTerms.find(grdTerm=> grdTerm.testTermsId == x.testTermsId);

        if (term)
        {
          term.answer = x.answer;
          term.matched = x.matched;
          term.answerId = x.answerId;
        }
        else
        {
          var term = this.TestTerms.find(grdTerm=> grdTerm.terms == x.terms);

          term.answer = x.answer;
          term.matched = x.matched;
          term.answerId = x.answerId;
          
        }
      });

      var localTerms = this.TestTerms;
      var api = this._testGridApi;
      this._testGridApi.forEachNode(function(rowNode, index)
      {
        var id = rowNode.data.testTermsId;
        var term = localTerms.find(grdTerm=> grdTerm.testTermsId == id);
        rowNode.data.matched = term.matched;
        rowNode.data.answer = term.answer;
        rowNode.data.answerId = term.answerId;
        rowNode.setData(term);

        api.flashCells({
          rowNodes: [rowNode]
        });
 
      });
        

      var params = {
        force: true,
        suppressFlash: false,
      };
      this._testGridApi.refreshCells(params);
      this.ShowCommit = true;
    }

    this._messagingService.LoadingMsg(false);
  }

  onCellClicked(data : any)
  {
    var loadType : FieldTypes;
    if (data.field == FieldTypes.Occupancy)
     {
      this.TestTerms = this._allTerms.filter(x=> x.loadTypeId == FieldTypes.Occupancy);
      loadType = FieldTypes.Occupancy;
     }
     else
     {
      this.TestTerms = this._allTerms.filter(x=> x.loadTypeId == FieldTypes.BuildingClass);
      loadType = FieldTypes.BuildingClass;
     }

     var addToTerms = new TestTerm({
      testTermsId : 0,
      loadTypeId : loadType,
      terms : data.value,
      isAddedTerm : true
     });

     this.TestTerms.push(addToTerms);

      this.TestTerms.forEach(x=> 
        {
          x.answer = "Not Run";
          x.matched = MatchedEnum.Na;
        });
 
      this.ShowTestTerms = true;
      this.ShowCommit = false;
  }

  public async Confirm()
  {
    var response = await this._maintenanceBl.DeleteLoadVal(this._selectedLoadValToDelete);

    if (response.status)
      await this.GetWords();
    
    this._modalService.dismissAll();
  }

  Cancel()
  {
    this._modalService.dismissAll();
  }

  async LoadLookups()
  {
    var user = this._authenticationService.currentUserValue;
    this._locationLookups = await this._lookupBl.GetLocationLookups();
    var response = await this._maintenanceBl.GetTestTerms(user.userId);
    this._allTerms = response.testTerms;
  }

  async GetWords()
  {
    var getWordsResponse = await this._maintenanceBl.Get();

    if (getWordsResponse.status)
    {
      this.LoadVals = getWordsResponse.loadVals;
      this.HasLoaded = true;
    } 
  }

}
