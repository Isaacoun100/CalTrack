import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSignUpNutri } from './app-sign-up-nutri';

describe('AppSignUpNutri', () => {
  let component: AppSignUpNutri;
  let fixture: ComponentFixture<AppSignUpNutri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSignUpNutri]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSignUpNutri);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
