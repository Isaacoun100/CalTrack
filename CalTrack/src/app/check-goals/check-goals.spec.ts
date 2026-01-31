import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckGoals } from './check-goals';

describe('CheckGoals', () => {
  let component: CheckGoals;
  let fixture: ComponentFixture<CheckGoals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckGoals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckGoals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
