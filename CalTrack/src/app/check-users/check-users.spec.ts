import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUsers } from './check-users';

describe('CheckUsers', () => {
  let component: CheckUsers;
  let fixture: ComponentFixture<CheckUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
