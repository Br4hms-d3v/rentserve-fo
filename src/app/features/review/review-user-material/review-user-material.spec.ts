import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUserMaterial } from './review-user-material';

describe('ReviewUserMaterial', () => {
  let component: ReviewUserMaterial;
  let fixture: ComponentFixture<ReviewUserMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewUserMaterial],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewUserMaterial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
