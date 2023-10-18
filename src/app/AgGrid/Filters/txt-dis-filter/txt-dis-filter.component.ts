import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from "@angular/core";

import {IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode} from "ag-grid-community";
import {IFilterAngularComp} from "ag-grid-angular";

@Component({
  selector: 'app-txt-dis-filter',
  templateUrl: './txt-dis-filter.component.html',
  styleUrls: ['./txt-dis-filter.component.css']
})
export class TxtDisFilterComponent implements OnInit, IFilterAngularComp {
  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  public text: string = ''; 

  constructor() { }

  ngOnInit() {
  }
  
  isFilterActive(): boolean {
    return true;
  }
  agInit(params: IFilterParams): void {
      this.params = params;
      this.valueGetter = params.valueGetter;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return true;
  }

  getModel(): any {
    return '';
  }

  setModel(model: any): void {
    
    debugger;
  }

}
