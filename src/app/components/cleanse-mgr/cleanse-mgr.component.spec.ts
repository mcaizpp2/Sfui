import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanseMgrComponent } from './cleanse-mgr.component';

describe('CleanseMgrComponent', () => {
  let component: CleanseMgrComponent;
  let fixture: ComponentFixture<CleanseMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanseMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanseMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
