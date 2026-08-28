import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFavor } from './category-favor';

describe('CategoryFavor', () => {
  let component: CategoryFavor;
  let fixture: ComponentFixture<CategoryFavor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFavor],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFavor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
