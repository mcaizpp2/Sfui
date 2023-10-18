import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericCtrlComponent } from './numeric-ctrl.component';

describe('NumericCtrlComponent', () => {
  let component: NumericCtrlComponent;
  let fixture: ComponentFixture<NumericCtrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumericCtrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
