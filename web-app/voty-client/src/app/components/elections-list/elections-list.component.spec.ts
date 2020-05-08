import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionsListComponent } from './elections-list.component';

describe('ElectionsListComponent', () => {
  let component: ElectionsListComponent;
  let fixture: ComponentFixture<ElectionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
