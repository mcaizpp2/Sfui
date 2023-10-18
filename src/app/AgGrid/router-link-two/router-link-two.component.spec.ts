import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterLinkTwoComponent } from './router-link-two.component';

describe('RouterLinkTwoComponent', () => {
  let component: RouterLinkTwoComponent;
  let fixture: ComponentFixture<RouterLinkTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterLinkTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterLinkTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
