import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnThisMonth } from './earn-this-month';

describe('EarnThisMonth', () => {
  let component: EarnThisMonth;
  let fixture: ComponentFixture<EarnThisMonth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarnThisMonth],
    }).compileComponents();

    fixture = TestBed.createComponent(EarnThisMonth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
