import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminBoardComponent } from './superadmin-board.component';

describe('SuperadminBoardComponent', () => {
  let component: SuperadminBoardComponent;
  let fixture: ComponentFixture<SuperadminBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
