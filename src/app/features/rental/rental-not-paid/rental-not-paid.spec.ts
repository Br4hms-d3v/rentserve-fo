import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalNotPaid } from './rental-not-paid';

describe('RentalNotPaid', () => {
  let component: RentalNotPaid;
  let fixture: ComponentFixture<RentalNotPaid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalNotPaid],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalNotPaid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
