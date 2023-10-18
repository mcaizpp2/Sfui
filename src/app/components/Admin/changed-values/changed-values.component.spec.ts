import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedValuesComponent } from './changed-values.component';

describe('ChangedValuesComponent', () => {
  let component: ChangedValuesComponent;
  let fixture: ComponentFixture<ChangedValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangedValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
