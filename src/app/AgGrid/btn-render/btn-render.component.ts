import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-btn-render',
  templateUrl: './btn-render.component.html',
  styleUrls: ['./btn-render.component.css']
})
export class BtnRenderComponent implements AgRendererComponent {

  params: any;
  HasVisibleLink : boolean;

  constructor() { }

  agInit(params: any): void {
    this.params = params;

    if (params.data.zipPath)
    {
      this.HasVisibleLink = true;
    }
    if (params.data.loadValId)
    {
      this.HasVisibleLink = true;
    }

    if (params.data.sprinklerValsId)
    {
      this.HasVisibleLink = true;
    }

    if (params.data.id)
    {
      this.HasVisibleLink = true;
    }

    if (params.data.state && params.label == "Commit")
    {
      this.HasVisibleLink = false;
    }
  }

  refresh(params: any): boolean {
    return false;
  }

  onClick()
  {
    this.params.onClick(this.params.data);
  }

}
