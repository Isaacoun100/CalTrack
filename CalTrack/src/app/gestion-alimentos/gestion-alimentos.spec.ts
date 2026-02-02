import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlimentos } from './gestion-alimentos';

describe('GestionAlimentos', () => {
  let component: GestionAlimentos;
  let fixture: ComponentFixture<GestionAlimentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAlimentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAlimentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
