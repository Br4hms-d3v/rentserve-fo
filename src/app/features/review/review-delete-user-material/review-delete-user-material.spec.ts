import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDeleteUserMaterial } from './review-delete-user-material';

describe('ReviewDeleteUserMaterial', () => {
  let component: ReviewDeleteUserMaterial;
  let fixture: ComponentFixture<ReviewDeleteUserMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewDeleteUserMaterial],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewDeleteUserMaterial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
