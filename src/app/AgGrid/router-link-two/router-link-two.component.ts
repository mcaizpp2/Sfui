import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-router-link-two',
  templateUrl: './router-link-two.component.html',
  styleUrls: ['./router-link-two.component.css']
})
export class RouterLinkTwoComponent implements AgRendererComponent  {

  params: any;
  HasVisibleLink : boolean;

  agInit(params: any): void {
    this.params = params;

    if (params.data.hasLocations)
    {
      this.HasVisibleLink = true;
    }
    if (params.data.cleansedMgrId) {
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

  constructor() { }

  ngOnInit() {
  }

}
