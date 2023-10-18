import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanseComponent } from './cleanse.component';

describe('CleanseComponent', () => {
  let component: CleanseComponent;
  let fixture: ComponentFixture<CleanseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
