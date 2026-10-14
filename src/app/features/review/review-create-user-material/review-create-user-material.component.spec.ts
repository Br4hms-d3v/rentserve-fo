import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCreateUserMaterial } from './review-create-user-material.component';

describe('ReviewCreateUserMarterial', () => {
  let component: ReviewCreateUserMaterial;
  let fixture: ComponentFixture<ReviewCreateUserMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCreateUserMaterial],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewCreateUserMaterial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
