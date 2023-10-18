import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentsDto } from '../../../../Models/Dtos/Cleansing/components-dto';
import { MapLkpDto } from '../../../../Models/Dtos/Cleansing/map-lkp-dto'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RowTypeDto } from '../../../../Models/Dtos/Cleansing/row-type-dto';
import { LookupDto, StrLookupDto } from '../../../../Models/Dtos/str-lookup-dto';

@Component({
  selector: 'app-map-lkp',
  templateUrl: './map-lkp.component.html',
  styleUrls: ['./map-lkp.component.css']
})
export class MapLkpComponent implements OnInit {
  public MapModalDto : MapLkpDto;
  private _components : ComponentsDto[];
  public MapVisible : boolean;
  constructor(private _modalService: NgbModal) { }

  @Input() set MapModal(value: MapLkpDto) {
    this.MapModalDto = value;
  }

  get MapModal(): MapLkpDto{
    return this.MapModalDto;
  }

  @Input() set Components(value: ComponentsDto[]) {
    this._components = value;
  }

  @Output() MapComplete = new EventEmitter<MapLkpDto>();


  ngOnInit(): void {
  }

  public Close()
  {
    this._modalService.dismissAll();
  }

  public CompTwoChange()
  {
    debugger;
    this.MapVisible = true;
 
    var components = this.GetComponents();

    var componentTwoRow = components[1].rows[0];
    this.MapModalDto.CompTwoNames = this.SetCompNames(componentTwoRow);
    this.MapModalDto.CompTwoIdx = components[1].componentId;
    this.MapModalDto.CompTwoWsIdx = components[1].componentOptions.workSheetId;
 
  }

  public Map()
  {
    this.MapComplete.emit(this.MapModalDto);
    this.Close();
  }

  private GetComponents() 
  {
    var joinId = this.MapModalDto.JoinCompId;
    var compTwo = this.MapModalDto.CompNames.find(x=> x.ComponentId == joinId)!;

    var componentOne = this._components.find(x=> x.componentId == this.MapModalDto.ComponentId)!;
    var componentTwo = this._components.find(x=> x.componentId == compTwo.ComponentId)!;
 
    var components : ComponentsDto[] = [];
    components.push(componentOne);
    components.push(componentTwo);
    return components;
  }

  private SetCompNames(row : RowTypeDto) : LookupDto[]
  {
    var headers : LookupDto[] = [];
    row.cells.forEach(cell=>
    {
      var headerLkp = new LookupDto({ Id:cell.colIdx, Value:cell.cellValue})
      headers.push(headerLkp);
    })
    
    return headers;
  }

}
