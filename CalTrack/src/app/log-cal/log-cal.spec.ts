import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogCal } from './log-cal';

describe('LogCal', () => {
  let component: LogCal;
  let fixture: ComponentFixture<LogCal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogCal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogCal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
