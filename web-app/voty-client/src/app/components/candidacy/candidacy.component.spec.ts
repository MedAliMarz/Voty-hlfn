import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidacyComponent } from './candidacy.component';

describe('CandidacyComponent', () => {
  let component: CandidacyComponent;
  let fixture: ComponentFixture<CandidacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
