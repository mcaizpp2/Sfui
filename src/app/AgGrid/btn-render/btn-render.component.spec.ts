import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnRenderComponent } from './btn-render.component';

describe('BtnRenderComponent', () => {
  let component: BtnRenderComponent;
  let fixture: ComponentFixture<BtnRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
