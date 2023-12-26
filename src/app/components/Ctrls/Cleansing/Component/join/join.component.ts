import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsDto } from '../../../../../Models/Dtos/Cleansing/components-dto';
import { JoinCriteria } from '../../../../../Models/Dtos/Cleansing/join-criteria';
import { JoinModalDto } from '../../../../../Models/Dtos/Cleansing/join-modal-dto';
import { RowTypeDto } from '../../../../../Models/Dtos/Cleansing/row-type-dto';
import { StrLookupDto } from '../../../../../Models/Dtos/str-lookup-dto';
import { JoinComp } from '../../../../../Models/Dtos/join-comp';
import { JoinSheet } from '../../../../../Models/Dtos/join-sheet';
import { CleanedWsDto } from '../../../../../Models/Dtos/Cleansing/cleanedWs-dto';
import { CompHeaderDto } from '../../../../../Models/Dtos/Cleansing/header-dto';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  public _joinModalDto : JoinModalDto;
  private _components: ComponentsDto[];
  private _joinComps: JoinComp[];
  public _joinSheets: JoinSheet[];

  public _joinCompsTwo: JoinComp[] = [];

  public ComponentOne: JoinComp;
  public ComponentOneWs: JoinSheet;

  public ComponentTwoWsIdx: number;
  public ComponentTwoIdx: number;

  public ComponentWs: string;
  public HasJoins: false;
  public CompTwoWsId: number;
  private _lstCleanedWs: CleanedWsDto[];
  constructor(private _modalService: NgbModal) { }

 
  @Input() set JoinModal(value: JoinModalDto) {

    this._joinModalDto = value;
  }
  @Input() set CleanedWs(value: CleanedWsDto[]) {
    debugger;
    this._lstCleanedWs = value;
  }

  get JoinModal(): JoinModalDto{
    
    return this._joinModalDto;
  }

  @Input() set JoinComps(value: JoinComp[]) {
    this._joinComps = value;
  }

  @Input() set JoinSheets(value: JoinSheet[]) {
    this._joinSheets = value;
  }

  @Input() set Components(value: ComponentsDto[]) {
    this._components = value;
  }

  @Output() JoinComplete = new EventEmitter<JoinModalDto>();

  public JoinVisible : boolean;

  ngOnInit(): void {
    debugger;
    this.ComponentOne = this._joinComps.find(x => x.compIdx == this._joinModalDto.ComponentId);
    this.ComponentOneWs = this._joinSheets.find(x => x.workSheetId == this.ComponentOne.workSheetId);
    debugger;
  }

  public Close()
  {
    this._modalService.dismissAll();
  }

  HandleJoinType()
  {
    var joinType = this.JoinModal.JoinType;

    var components = this.GetComponents();
    debugger;
    if (joinType == 2)
    {
    this.HandleMerge(components);
    }
    if (joinType == 1)
    {
      this.HandleJoin(components);
    }
  }

  private HandleJoin(components : ComponentsDto[])
  {
    //var componentOneRow = components[0].rows[0];
    var componentOneHeaders = components[0].headers;

    //var componentTwoRow = components[1].rows[0];
    var componentTwoHeaders = components[1].headers;
   
    this._joinModalDto.CompTwoWsIdx = components[1].componentOptions.workSheetId;
    this._joinModalDto.CompTwoIdx = components[1].componentOptions.compIdx;

    this.AddJoinType(1, components[0], components[1], componentTwoHeaders, componentOneHeaders);
      

  }

  private HandleMerge(components: ComponentsDto[]) {
    debugger;
    var selectedComponentOneWs = this._lstCleanedWs.find(x => x.workSheetId == this.ComponentOneWs.workSheetId);
    var selectedComponentOne = selectedComponentOneWs.components.find(x => x.componentId == this.ComponentOne.compIdx);
    var componentOneRow = selectedComponentOne.rows[0];
    var componentOneHeaders = selectedComponentOne.headers;

    var ignore = new CompHeaderDto
      (
        {
          colIdx: -1,
          colName : "Ignore"
        }
      );


    var selectedComponentTwoWs = this._lstCleanedWs.find(x => x.workSheetId == this.ComponentTwoWsIdx);
    var selectedComponentTwo = selectedComponentTwoWs.components.find(x => x.componentId == this.ComponentTwoIdx);

    var componentTwoHeaders = selectedComponentTwo.headers;
    componentTwoHeaders.unshift(ignore);
    var id = 1;
    this._joinModalDto.CompTwoWsIdx = selectedComponentTwoWs.workSheetId;
    this._joinModalDto.CompTwoIdx = selectedComponentTwo.componentId;

    this._joinModalDto.IsMerge = true;
    componentOneHeaders.forEach(x => {
      this.AddMergeType(x, id, selectedComponentOne, selectedComponentTwo, componentTwoHeaders);
      id++;
    });
  }

  private GetComponents() 
  {
    var joinId = this.JoinModal.JoinCompId;
    var compTwo = this.JoinModal.CompNames.find(x=> x.Id == joinId);

    var componentOne = this._components.find(x=> x.componentId == this.JoinModal.ComponentId)!;
    var componentTwo = this._components.find(x=> x.componentId == compTwo?.ComponentId)!;
 
    var components : ComponentsDto[] = [];
    components.push(componentOne);
    components.push(componentTwo);
    return components;
  }

  private AddJoinType(id: number, componentOne: ComponentsDto, componentTwo: ComponentsDto, compTwoHeaders: CompHeaderDto[], compOneHeaders: CompHeaderDto[])
  {
    debugger;
    var joinCriteria = new JoinCriteria({
      Id : id,
      CompOne : componentOne.name,
      CompOneWs : componentOne.componentOptions.workSheet,
      CompTwo : componentTwo,
      CompTwoWs : componentTwo.componentOptions.workSheet,

      ComponentOneHeaders : compOneHeaders,
      ComponentTwoHeaders : compTwoHeaders,
      SelectedJoinType :this._joinModalDto.JoinType,
      IsMerge : false
    });
    debugger;
    this.JoinModal.JoinCriteria.push(joinCriteria);
  }

  private AddMergeType(compOneSelected: CompHeaderDto, id: number, componentOne: ComponentsDto, componentTwo: ComponentsDto, compTwoHeaders: CompHeaderDto[])
  {
    var joinCriteria = new JoinCriteria({
      Id : id,
      CompOne : componentOne.name,
      CompOneWs : componentOne.componentOptions.workSheet,
      CompTwo : componentTwo,
      CompTwoWs : componentTwo.componentOptions.workSheet,

      ComponentTwoHeaders : compTwoHeaders,
      SelectedJoinType :this._joinModalDto.JoinType,
      CompOneSelected: compOneSelected.colIdx,
      CompOneDisplay : compOneSelected.colName
     
    });

    this.JoinModal.JoinCriteria.push(joinCriteria);
  }

  public CompTwoChange()
  {
    this.HandleJoinType();
    this.JoinVisible = true;
  }

  public onJoinCondition(joinCriteria : JoinCriteria)
  {
    var foundIdx = this.JoinModal.JoinCriteria.findIndex(x=> x.Id == joinCriteria.Id);
    if (foundIdx > -1)
    {
      this.JoinModal.JoinCriteria.splice(foundIdx, 1);
    }
    
    if (this.JoinModal.JoinCriteria.length == 0)
    {
      this.JoinVisible = false;
    }
  }

  public Join()
  {
    this.JoinComplete.emit(this.JoinModal);
    this.Close();
  }

  //private SetCompNames(headers: CompHeaderDto[]) : StrLookupDto[]
  //{
  //  var headers : StrLookupDto[] = [];
  //  row.cells.forEach(cell=>
  //  {
  //    var headerLkp = new StrLookupDto({ Id:cell.colIdx, Value:cell.cellValue})
  //    headers.push(headerLkp);
  //  })
    
  //  return headers;
  //}

  public changeCompTwoWs($event: any) {
 
    this._joinCompsTwo = [];

    var filterComps = this._joinComps.filter(x => x.workSheetId == $event.workSheetId);

    filterComps.forEach(f => {
      this._joinCompsTwo.push(f);
    });

  }

 
  

}
