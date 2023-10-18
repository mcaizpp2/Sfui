import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapHeaderDto } from "../../../Models/Dtos/map-header-dto";

@Component({
  selector: 'app-numeric-ctrl',
  templateUrl: './numeric-ctrl.component.html',
  styleUrls: ['./numeric-ctrl.component.css']
})
export class NumericCtrlComponent implements OnInit {
  @Input() 
  Mapping : MapHeaderDto;

  @Output() 
  valueChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public Add()
  {
    this.Mapping.priority++;
    this.valueChange.emit(this.Mapping);
  }

  public Down()
  {
    if (this.Mapping.priority == 1)
      return;

    this.Mapping.priority--;

    this.valueChange.emit(this.Mapping);
  }

}
