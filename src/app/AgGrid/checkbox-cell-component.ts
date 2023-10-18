import { ElementRef, Component} from '@angular/core';
import { AgRendererComponent} from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { ChkMessage } from '../Models/chk-message';
import { MediatorService } from '../Services/mediator.service';

@Component({
    selector: 'checkbox-cell',
    templateUrl: './checkbox-cell.component.html',
    styleUrls: ['./checkbox-cell.component.css']
  })
  export class CheckBoxCellComponent implements AgRendererComponent {
  
    public params: any;

    constructor(private _mediatorService : MediatorService)
    {

    }
  
    agInit(params: any): void {
      this.params = params;
    }
  
    afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    }
  
    refresh(params: any): boolean {
      params.data.reconciled = params.value
      
      params.api.refreshCells(params);

      var chkMsg = new ChkMessage({LocId : params.data.locId, Checked : params.value});

      this._mediatorService.Checked.emit(chkMsg);

      return false;
    }
  }