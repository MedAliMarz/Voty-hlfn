import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterBoardComponent } from './voter-board.component';

describe('VoterBoardComponent', () => {
  let component: VoterBoardComponent;
  let fixture: ComponentFixture<VoterBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoterBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
