import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RowTypeEnum } from '../../Models/Enums/row-type-enum';
import { CleansingBl} from '../../Bl/cleansing-bl';
import { CleanedWsDto } from '../../Models/Dtos/Cleansing/cleanedWs-dto';
import { ComponentsDto } from '../../Models/Dtos/Cleansing/components-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../Services/message-service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColumnOptionsDto } from '../../Models/Dtos/Cleansing/column-dtos';
import { WsCellDto } from '../../Models/Dtos/Cleansing/ws-cell-dto';
import { MenuOption} from '../../Models/Dtos/Cleansing/menu-option';
import { OperationTypeDto } from '../../Models/Dtos/Cleansing/operation-type-dto';
import { OperationsDto } from '../../Models/Dtos/Cleansing/operations-dto';
import { ComponentOptionsDto } from '../../Models/Dtos/Cleansing/component-options-dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JoinModalDto } from '../../Models/Dtos/Cleansing/join-modal-dto';
import { MapLkpDto } from '../../Models/Dtos/Cleansing/map-lkp-dto'; 
import { MapCriteria } from '../../Models/map-criteria';
import { JoinCriteria } from '../../Models/Dtos/Cleansing/join-criteria';
import { ComponentLkpDto, StrLookupDto } from '../../Models/Dtos/str-lookup-dto';
import { JoinTypeEnum } from '../../Models/Enums/join-type-enum';
import { OperationValidationDto } from '../..//Models/Dtos/Cleansing/operation-validation-dto';
import { RowTypeDto } from '../../Models/Dtos/Cleansing/row-type-dto';
import { RowOptionsDto } from '../..//Models/Dtos/Cleansing/row-options-dto';
import { AuthenticationService } from '../..//Data/authentication-service';
import { JoinSheet } from '../../Models/Dtos/join-sheet';
import { JoinComp } from '../../Models/Dtos/join-comp';

@Component({
  selector: 'app-cleanse',
  templateUrl: './cleanse.component.html',
  styleUrls: ['./cleanse.component.css']
})
export class CleanseComponent implements OnInit {
@ViewChild('joinTemplate',{static: true}) joinElement : TemplateRef<any>;
@ViewChild('mapTemplate',{static: true}) mapElement : TemplateRef<any>;
@ViewChild('validationsTemplate',{static: true}) valElement : TemplateRef<any>;
@ViewChild(MatMenuTrigger)
contextMenu: MatMenuTrigger;

@ViewChild(MatMenuTrigger)
comContextMenu: MatMenuTrigger;

contextMenuPosition = { x: '0px', y: '0px' };


constructor(private _cleansingBl : CleansingBl,
          private _route: ActivatedRoute,
          private _router : Router,
          private _messagingService : MessageService,
          private _modalService: NgbModal,
          private _authenticationService : AuthenticationService) { }

  private _cleanseMgrId : number;
  public FilePath : string = 'Please Drop File Here';
  public Processed = false;
  public Components : ComponentsDto[] = [];
  public CleanedDtos: CleanedWsDto[];
  public JoinSheets: JoinSheet[] = [];

  public JoinComps: JoinComp[] = [];
  public MenuOption : MenuOption;
  public Operations : OperationsDto[];
  public JoinModalDto : JoinModalDto;
  public MapLkpDto : MapLkpDto;
  public Validations : OperationValidationDto[];
  public Export : boolean;

  async ngOnInit() {
   this._route.params.subscribe(params => {
      this._cleanseMgrId = +params['id'];
   });

    this._messagingService.LoadingMsg(true);
    await this.LoadOperations();
    await this.Load(true);
    this._messagingService.LoadingMsg(false);

    this.LoadValidations();
  }

  onRowClick(event : MouseEvent, row : RowTypeDto, component : ComponentsDto)
  { 
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    this.AssignMenuOptions(component.componentId, component.name, undefined,undefined, row.rowOptions);
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onColRightClick(event : MouseEvent, cell : WsCellDto, component : ComponentsDto){
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    var selectedColOption = component.columnOptions.find(x=> x.colIdx == cell.colIdx);
    this.AssignMenuOptions(component.componentId, component.name, selectedColOption, undefined, undefined);
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onComClick(event : MouseEvent,  component : ComponentsDto){
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    var selectedComponentOptions = component.componentOptions;
    this.AssignMenuOptions(component.componentId, component.name, undefined, selectedComponentOptions, undefined);
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onCompUnion(operationType : OperationTypeDto)
  {
    this.onModalCommon(operationType, 2, "Union");
  }

  onMapUnion(operationType : OperationTypeDto)
  {
  
     this.MapLkpDto = new MapLkpDto(
    {
      Component:this.MenuOption.ComponentName, 
      ComponentId : this.MenuOption.ComponentId, 
      ModalHeader : "Map Lookup Column",
      OperationType : operationType
    });

    var component = this.Components.find(x=> x.componentId == this.MenuOption.ComponentId)!;

    var selectedCol = component.columnOptions.find(x=> x.colIdx == this.MenuOption.ColIdx)!;
    this.MapLkpDto.CompOneColIdx = this.MenuOption.ColIdx;
    this.CreateCompNames(this.MapLkpDto.CompNames);

    this._modalService.open(this.mapElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private CreateCompNames(comp : ComponentLkpDto[] )
  {
    var selectedComponent = this.Components.find(x=> x.componentId == this.MenuOption.ComponentId)!;
    debugger;
    this.CleanedDtos.forEach(cl=>
      {
  
        if (cl.workSheet != 'Processed')
        {
          cl.components.forEach(cmp=>
          {
            var add = false;
            if (cmp.name != selectedComponent.name && this.MenuOption.WorkSheetId == cl.workSheetId)
            {
              add = true;
            }
            if (cmp.name == selectedComponent.name)
            {
              if (this.MenuOption.WorkSheet != cl.workSheet)
              {
                add = true;
              }
            }
            if (add)
            {
              comp.push({ Id: cl.workSheetId, Value : cl.workSheet + " - " + cmp.name, WorkSheet : cl.workSheet, ComponentId : cmp.componentId});
            }
            });
        }
    });

    debugger;

  }

   onModalCommon(operationType : OperationTypeDto, joinType : number, modalHeader : string)
   {
    this.JoinModalDto = new JoinModalDto
    (
      { 
        ComponentId:this.MenuOption.ComponentId, 
        CompNames : [], 
        OperationType : operationType,
        ModalHeader : modalHeader, 
        JoinType : joinType
      }
    );
    
    this.CreateCompNames(this.JoinModalDto.CompNames);

    this._modalService.open(this.joinElement, { ariaLabelledBy: 'modal-basic-title'});
  
   }

  onCompJoinContext(operationType : OperationTypeDto)
  {
    this.onModalCommon(operationType, 1, "Join");
  }

  public OnJoinCompChange()
  {

    this.JoinModalDto.JoinCriteria = [];
    this.JoinModalDto.JoinVisible = true;

    var joinId = this.JoinModalDto.JoinCompId;
    var joinComp = this.JoinModalDto.CompNames.find(x=> x.Id == joinId)!;

    //get distinct header value for 1st comp
    var componentOne = this.Components.find(x=> x.componentId == this.JoinModalDto.ComponentId)!;
    var componentTwo = this.Components.find(x=> x.componentId == joinComp.ComponentId)!;

    var componentOneRow = componentOne.rows[0];
    var componentOneHeaders : StrLookupDto[] = [];
    componentOneRow.cells.forEach(cell=>
    {
      componentOneHeaders.push(new StrLookupDto({ Id:cell.cellValue, Value:cell.cellValue}));
    });

    var componentTwoRow = componentTwo.rows[0];
    var componentTwoHeaders : StrLookupDto[] = [];
    componentTwoRow.cells.forEach(cell=>
    {
      componentTwoHeaders.push(new StrLookupDto({ Id:cell.cellValue, Value:cell.cellValue}));
    });

    var joinTypes : JoinTypeEnum[] = [];
    joinTypes.push(JoinTypeEnum.Left);
    joinTypes.push(JoinTypeEnum.Right);

    var joinCriteria = new JoinCriteria
    ({
      CompOne : componentOne.name,
      CompOneWs : componentOne.componentOptions.workSheet,
      CompTwo : joinComp.ComponentId,
      CompTwoWs : joinComp.WorkSheet,
      JoinTypes : joinTypes,
      CompOneFields : componentOneHeaders,
      CompTwoFields : componentTwoHeaders,
      SelectedJoinType : JoinTypeEnum.Left
    });

    this.JoinModalDto.JoinCriteria.push(joinCriteria);
  }

  public async JoinComplete(joinModal : JoinModalDto)
  { 
    await this.ProcessJoinOperation(this.JoinModalDto.OperationType, joinModal.JoinCriteria);
  }

  public async MapComplete(mapModalDto : MapLkpDto)
  {
    var t = mapModalDto;
    var mapCriteria = new MapCriteria();

    mapCriteria.LookupComponentId = mapModalDto.JoinCompId;
    mapCriteria.MapIdx = mapModalDto.MapColumn;
    mapCriteria.ValueIdx = mapModalDto.ValueColumn;

    await this.ProcessMapOperation(mapModalDto.OperationType, mapCriteria);
  }
  
  
  private AssignMenuOptions(componentId : number, componentName : string,  columnOption : ColumnOptionsDto | undefined, componentOptions : ComponentOptionsDto | undefined, rowOptions : RowOptionsDto | undefined)
  {
    this.MenuOption = new MenuOption();
    this.MenuOption.ComponentId  = componentId;
    this.MenuOption.ComponentName = componentName;

    if (columnOption)
    {
      this.ColumnMenuOptions(columnOption);
    }
    else
    {
      this.ColumnMenuOptionsNull();
    }

    if (componentOptions)
    {
      this.ComponentMenuOptions(componentOptions);
    }
    else
    {
      this.ComponentMenuOptionsNull();
    }

    if (rowOptions)
    {
      this.RowMenuOptions(rowOptions);
    }
    else
    {
      this.RowMenuOptionsNull();
    }
  }

  private ComponentMenuOptionsNull()
  {
    this.MenuOption.AddOrigin = new OperationTypeDto({ visible : false});
    this.MenuOption.RemoveComponent = new OperationTypeDto({ visible : false});
    this.MenuOption.Join = new OperationTypeDto({ visible : false});
    this.MenuOption.Union = new OperationTypeDto({ visible : false});
    this.MenuOption.AddHeader = new OperationTypeDto({ visible : false});
  }

  private ComponentMenuOptions(componentOptions : ComponentOptionsDto)
  {
    this.MenuOption.AddOrigin = componentOptions.addOrigin;
    this.MenuOption.RemoveComponent = componentOptions.remove;
    this.MenuOption.Join = componentOptions.join;
    this.MenuOption.WorkSheet = componentOptions.workSheet;
    this.MenuOption.WorkSheetId = componentOptions.workSheetId;
    this.MenuOption.Union = componentOptions.union;
    this.MenuOption.AddHeader = componentOptions.addHeader;
  }

  private RowMenuOptionsNull()
  {
    this.MenuOption.RemoveRow = new OperationTypeDto({ visible : false });
    this.MenuOption.SetHeader = new OperationTypeDto({ visible : false });
  }

  private RowMenuOptions(rowOptions : RowOptionsDto)
  {
    this.MenuOption.RemoveRow = rowOptions.removeRow;
    this.MenuOption.SetHeader = rowOptions.setHeader;
    this.MenuOption.WorkSheet = rowOptions.workSheet;
    this.MenuOption.WorkSheetId = rowOptions.workSheetId;
    this.MenuOption.RowIdx = rowOptions.rowIdx;
    this.MenuOption.ComponentId = rowOptions.componentId;

  }
  
  private ColumnMenuOptions(columnOption : ColumnOptionsDto)
  {
    this.MenuOption.Remove = columnOption.remove;
    this.MenuOption.Split = columnOption.split;
    this.MenuOption.Map = columnOption.map;
    this.MenuOption.WorkSheet = columnOption.workSheet;
    this.MenuOption.WorkSheetId = columnOption.workSheetId;
    this.MenuOption.ColIdx = columnOption.colIdx;
    this.MenuOption.ComponentId = columnOption.componentId;
    this.MenuOption.ComponentName = columnOption.component;
  }

  private ColumnMenuOptionsNull()
  {
    this.MenuOption.Remove = new OperationTypeDto({ visible : false });
    this.MenuOption.Split = new OperationTypeDto({ visible : false });
    this.MenuOption.Map = new OperationTypeDto({ visible : false });
  }

  public async onColContext(operationType : OperationTypeDto)
  {
    await this.ProcessOperation(operationType);
  }

  public async onCompContext(operationType : OperationTypeDto)
  {
    await this.ProcessOperation(operationType);
  }

  private async ProcessOperation(operationType)
  {
    this._messagingService.LoadingMsg(true);

    // add operation
    var compTwoWsIdx = null;
    var compTwoIdx = null;
  
    var response = await this._cleansingBl.AddOperation(this._cleanseMgrId,operationType,  this.MenuOption, compTwoWsIdx, compTwoIdx,null,null, []);
    await this.LoadOperations();
    await this.Load(false);
    this._modalService.dismissAll();

    this._messagingService.LoadingMsg(false);

    this.LoadValidations();

  }

  private async ProcessJoinOperation(operationType, joins : JoinCriteria[] = [])
  {
    this._messagingService.LoadingMsg(true);

    // add operation
    var compTwoWsIdx = null;
    var compTwoIdx = null;
  
    if (this.JoinModalDto)
    {
      compTwoIdx = this.JoinModalDto.CompTwoIdx;
      compTwoWsIdx = this.JoinModalDto.CompTwoWsIdx;
    }
    var response = await this._cleansingBl.AddOperation(this._cleanseMgrId,operationType, this.MenuOption, compTwoIdx,compTwoWsIdx, null, null, joins);
    await this.LoadOperations();
    await this.Load(false);
    this._modalService.dismissAll();
    this.LoadValidations();

    this._messagingService.LoadingMsg(false);

  }
  private async ProcessMapOperation(operationType, mapCritera : MapCriteria)
  {
    this._messagingService.LoadingMsg(true);

    // add operation
    var compTwoWs = null;
    var compTwo = null;
    var mapColIdx = null;
    var valueColIdx = null;

    if (this.MapLkpDto)
    {
      compTwo = this.MapLkpDto.CompTwoIdx;
      compTwoWs = this.MapLkpDto.CompTwoWsIdx;
      mapColIdx = this.MapLkpDto.MapColumn;
      valueColIdx = this.MapLkpDto.ValueColumn;
      
    }
 
    var response = await this._cleansingBl.AddOperation(this._cleanseMgrId,operationType, this.MenuOption, compTwo,compTwoWs, mapColIdx, valueColIdx,[]);
    await this.LoadOperations();
    await this.Load(false);
    this._modalService.dismissAll();

    this.LoadValidations();

    this._messagingService.LoadingMsg(false);

  }
  
  private LoadValidations()
  {
    if (this.Validations.length >= 1)
    {
        this._modalService.open(this._modalService.open(this.valElement, { ariaLabelledBy: 'modal-basic-title'}));
    };
  }
  public SetComponents(wsName : string)
  {
    if (wsName == "Processed")
    {
      this.Export = true;
    }
    else
    {
      this.Export = false;
    }

    this.Components = [];
    var cleanseDto = this.CleanedDtos.find(x=> x.workSheet === wsName)!;

    cleanseDto.components.forEach(com=>
    {
      this.Components.push(com);
    });
  }

  public async LoadOperations()
  {
    var response = await this._cleansingBl.LoadOperations(this._cleanseMgrId);
    if (response.status)
    {
      this.Operations = response.operations
    
    }
  } 

  public Close()
  {
    this._modalService.dismissAll();
  }

  public async Load(show : boolean = true)
  {
    var response = await this._cleansingBl.Load(this._cleanseMgrId, show);
    var cleaned = response.cleanedDtos;
    cleaned.push(response.processed);

    var cleansed = response.cleanedDtos[0];
    this.CleanedDtos = response.cleanedDtos;
    this.SetComponents(cleansed.workSheet);

    this.JoinSheets = [];
    this.JoinComps = [];
    response.cleanedDtos.forEach(x => {
      this.JoinSheets.push(new JoinSheet({ workSheetId: x.workSheetId, name: x.workSheet }));

      x.components.forEach(comp => {
        this.JoinComps.push(new JoinComp({ name: comp.name, compIdx: comp.componentId, workSheetId: x.workSheetId }));
      });
    });

    this.Validations = response.validations;

    this.Operations.forEach(op=>
    {
      var ws = this.CleanedDtos.find(cd => cd.workSheetId == op.workSheetId);
      op.workSheet = ws.workSheet;

      var cmp = ws.components.find(c=> c.componentId == op.componentId);
      if (cmp == null)
      {
        return;
      }
      op.component = cmp.name;
      
      if (op.colIdx > 0)
      {
          var col = cmp.rows[0].cells[op.colIdx];

          if (col != null)
          {
            var val = col.cellValue;
            op.field = val;
          }
      }
    });
    this.Processed = true;
  }

  public IsHeader(rowType : RowTypeEnum)
  {
    return rowType == 4;
  }

  public IsExport()
  {
    if (this.Export)
    {
      return true;
    }
    return false;
  }

  public IsTotal(rowType : RowTypeEnum)
  {
    return rowType == 5;
  }

  public ShowOpHistory()
  {
    document.getElementById("OpHistory")!.style.width = "480px";
  }

  public CloseOpHistory()
  {
    document.getElementById("OpHistory")!.style.width = "0";
  }

  public async DeleteOp(operationsId : number)
  {
    this._messagingService.LoadingMsg(true);
    var response = await this._cleansingBl.DeleteOperation(operationsId);

    if (response.status)
    {
      await this.LoadOperations();
      await this.Load(false);
    }

    this.CloseOpHistory();
   

    this.LoadValidations();

    this._messagingService.LoadingMsg(false);
  }

  public async ExportCleaned()
  {
    var user = this._authenticationService.currentUserValue;

    this._messagingService.LoadingMsg(true);
    
    var exportResponse = await this._cleansingBl.Export(this._cleanseMgrId, user);

    this._messagingService.LoadingMsg(false);

    this._router.navigate(['/manager']);
  }

}
