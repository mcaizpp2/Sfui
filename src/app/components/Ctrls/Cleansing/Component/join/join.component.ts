import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsDto } from '../../../../../Models/Dtos/Cleansing/components-dto';
import { JoinCriteria } from '../../../../../Models/Dtos/Cleansing/join-criteria';
import { JoinModalDto } from '../../../../../Models/Dtos/Cleansing/join-modal-dto';
import { RowTypeDto } from '../../../../../Models/Dtos/Cleansing/row-type-dto';
import { StrLookupDto } from '../../../../../Models/Dtos/str-lookup-dto';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  public _joinModalDto : JoinModalDto;
  private _components : ComponentsDto[];

  public HasJoins : false;
  constructor(private _modalService: NgbModal) { }

  @Input() set JoinModal(value: JoinModalDto) {

    this._joinModalDto = value;
  }

  get JoinModal(): JoinModalDto{
    
    return this._joinModalDto;
  }

  @Input() set Components(value: ComponentsDto[]) {
    debugger;
    this._components = value;
  }

  @Output() JoinComplete = new EventEmitter<JoinModalDto>();

  public JoinVisible : boolean;

  ngOnInit(): void {
  }

  public Close()
  {
    this._modalService.dismissAll();
  }

  HandleJoinType()
  {
    var joinType = this.JoinModal.JoinType;

    var components = this.GetComponents();
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
    var componentOneRow = components[0].rows[0];
    var componentOneHeaders = this.SetCompNames(componentOneRow);

    var componentTwoRow = components[1].rows[0];
    var componentTwoHeaders = this.SetCompNames(componentTwoRow);
   
    this._joinModalDto.CompTwoWsIdx = components[1].componentOptions.workSheetId;
    this._joinModalDto.CompTwoIdx = components[1].componentOptions.compIdx;

    this.AddJoinType(1, components[0], components[1], componentTwoHeaders, componentOneHeaders);
      

  }

  private HandleMerge(components : ComponentsDto[])
  {
    var componentOneRow = components[0].rows[0];
    var componentOneHeaders = this.SetCompNames(componentOneRow);

    var ignore = new StrLookupDto
    (
      {
        Id : -1,
        Value : "Ignore"
      }
    );

    var componentTwoRow = components[1].rows[0];
    var componentTwoHeaders = this.SetCompNames(componentTwoRow);
    componentTwoHeaders.unshift(ignore);

    var id = 1;
    this._joinModalDto.CompTwoWsIdx = components[1].componentOptions.workSheetId;
    this._joinModalDto.CompTwoIdx = components[1].componentOptions.compIdx;

    this._joinModalDto.IsMerge = true;
    componentOneHeaders.forEach(x=>
    {
      this.AddMergeType(x,id, components[0], components[1], componentTwoHeaders);
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

  private AddJoinType(id : number,componentOne: ComponentsDto, componentTwo: ComponentsDto, compTwoHeaders : StrLookupDto[], compOneHeaders : StrLookupDto[])
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

  private AddMergeType(compOneSelected : StrLookupDto, id : number,componentOne: ComponentsDto, componentTwo: ComponentsDto, compTwoHeaders : StrLookupDto[])
  {
    var joinCriteria = new JoinCriteria({
      Id : id,
      CompOne : componentOne.name,
      CompOneWs : componentOne.componentOptions.workSheet,
      CompTwo : componentTwo,
      CompTwoWs : componentTwo.componentOptions.workSheet,

      ComponentTwoHeaders : compTwoHeaders,
      SelectedJoinType :this._joinModalDto.JoinType,
      CompOneSelected : compOneSelected.Id,
      CompOneDisplay : compOneSelected.Value
     
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

  private SetCompNames(row : RowTypeDto) : StrLookupDto[]
  {
    var headers : StrLookupDto[] = [];
    row.cells.forEach(cell=>
    {
      var headerLkp = new StrLookupDto({ Id:cell.colIdx, Value:cell.cellValue})
      headers.push(headerLkp);
    })
    
    return headers;
  }
  

}
