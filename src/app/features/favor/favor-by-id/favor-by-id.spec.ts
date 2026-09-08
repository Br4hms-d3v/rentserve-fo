import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorById } from './favor-by-id';

describe('FavorById', () => {
  let component: FavorById;
  let fixture: ComponentFixture<FavorById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorById],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
