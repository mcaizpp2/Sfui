import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LookupBl } from '../../../Bl/lookup-bl';
import { StateDto } from '../../../Models/Dtos/state-dto';

@Component({
  selector: 'app-state-editor',
  templateUrl: './state-editor.component.html',
  styleUrls: ['./state-editor.component.css']
})

export class StateEditorComponent  implements OnInit, AfterViewInit{
    private _params : any;
    public States :StateDto[];

    public Selected : number;
    constructor(private _lookupBl : LookupBl)
    {

    }

    async ngOnInit()
    {
      await this.LoadLookups();
    }
    async ngAfterViewInit() {}

      isPopup() {
        return true;
      }
    
    async agInit(params: any) {
        this._params = params;
        var value = params.values[0];
        await this.LoadLookups();
       
    }

    getValue() {
      var states = this.States.find(x=> x.id == this.Selected);

      return states.code;
    }

    private async LoadLookups()
    {
      var lookupsResponse = await this._lookupBl.GetLocationLookups();

      if (lookupsResponse.status == true)
      {
        this.States = lookupsResponse.states;

        if (this.States)
        {
          var states = this.States.find(x=> x.code == this._params.value);
          this.Selected = states.id;
        }

      }

    }
  }
