import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMaterial } from './category-material';

describe('CategoryMaterial', () => {
  let component: CategoryMaterial;
  let fixture: ComponentFixture<CategoryMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMaterial],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryMaterial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
