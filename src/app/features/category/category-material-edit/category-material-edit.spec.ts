import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMaterialEdit } from './category-material-edit';

describe('CategoryMaterialEdit', () => {
  let component: CategoryMaterialEdit;
  let fixture: ComponentFixture<CategoryMaterialEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMaterialEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryMaterialEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
