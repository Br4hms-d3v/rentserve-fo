import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewEditUserMaterial } from './review-edit-user-material';

describe('ReviewEditUserMaterial', () => {
  let component: ReviewEditUserMaterial;
  let fixture: ComponentFixture<ReviewEditUserMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewEditUserMaterial],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewEditUserMaterial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
