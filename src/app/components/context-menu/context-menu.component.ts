import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  @Input() x : number = 0;
  @Input() y : number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  

}
