import { AfterViewInit, Component, EventEmitter, Input, OnInit,Output,TemplateRef, ViewChild } from '@angular/core';

import { PagingResponse } from '../../Models/Response/paging-response';
import { PagingDto } from '../../Models/Dtos/paging-dto'

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {

  private _paging : PagingResponse;
  private _typeId : number;

  @Input() set Paging(value: PagingResponse) {
  
    this._paging = value;
    if (value == null)
      return;
    this.SendPagingDto();
  }

  
  get Paging(): PagingResponse {
    return this._paging;
  }

  @Input() set TypeId(value: number) {
    this._typeId = value;
  
  }

  get TypeId(): number {
    return this._typeId;
  }

  @Output() PagingChanged= new EventEmitter<PagingDto>();

 
  public IsPagePrevious() : boolean
  {
    if (this._paging.current > 1)
    {
      return false;
    }

    return true;
  }
  public IsPageLast() : boolean
  {
    if (this._paging.current > 1)
    {
    
      return false;
    }

    return true;
  }

  public IsPageNext() : boolean
  {
    if (this._paging.current < this._paging.totalPages)
    {
      return false;
    }

    return true;
  }

  public IsPageFinal() : boolean
  {
    if (this._paging.current ==  this._paging.totalPages)
    {
    
      return true;
    }

    return false;
  }

  constructor() { }

  ngOnInit() {
  }

  public Next()
  {
    this._paging.current++;
   
    this.SendPagingDto();
  }

  public Last()
  {
    this._paging.current = this._paging.totalPages;

    this.SendPagingDto();
  }

  public Previous()
  {
    this._paging.current--;
   
    this.SendPagingDto();
  }

  public First()
  {
    this._paging.current = 1;
   
    this.SendPagingDto();
  }

  private SendPagingDto()
  {
    var first = this.CalRecFirst(this.Paging.current, this.Paging.recsPerPage);
    var recLast = this.CalcRecLast(this.Paging.current, this.Paging.recsPerPage);

    this.Paging.recFirst = first+1;
    this.Paging.recLast = recLast;

    var pagingDto = new PagingDto({ TypeId : this.TypeId, Filters : "", RecFirst : first, RecLast : this.Paging.recsPerPage });
    this.PagingChanged.emit(pagingDto);
  }

  private CalRecFirst(current : number, recsPerPage : number)
  {
    var t = current * recsPerPage;
    var recFirst = t - (recsPerPage - 1);
    return recFirst;
  }

  private CalcRecLast(current : number, recsPerPage : number)
  {
    var t = current * recsPerPage;
    if (t > this.Paging.total)
    {
      t = this.Paging.total;
    }

    return t;
  }
}
