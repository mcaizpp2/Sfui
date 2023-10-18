import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-router-link',
  templateUrl: './router-link.component.html',
  styleUrls: ['./router-link.component.css']
})
export class RouterLinkComponent implements AgRendererComponent {
  params: any;
  HasVisibleLink : boolean;

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

    if (params.data.cleansedMgrId)
    {
      this.HasVisibleLink = true;
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
