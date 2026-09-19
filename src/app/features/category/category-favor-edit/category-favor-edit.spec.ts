import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFavorEdit } from './category-favor-edit';

describe('CategoryFavorEdit', () => {
  let component: CategoryFavorEdit;
  let fixture: ComponentFixture<CategoryFavorEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFavorEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFavorEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
