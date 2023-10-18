import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxtDisFilterComponent } from './txt-dis-filter.component';

describe('TxtDisFilterComponent', () => {
  let component: TxtDisFilterComponent;
  let fixture: ComponentFixture<TxtDisFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxtDisFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxtDisFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
