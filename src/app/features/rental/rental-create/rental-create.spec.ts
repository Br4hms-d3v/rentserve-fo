import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalCreate } from './rental-create';

describe('RentalCreate', () => {
  let component: RentalCreate;
  let fixture: ComponentFixture<RentalCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
