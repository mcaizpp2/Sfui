import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLkpComponent } from './map-lkp.component';

describe('MapLkpComponent', () => {
  let component: MapLkpComponent;
  let fixture: ComponentFixture<MapLkpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLkpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
