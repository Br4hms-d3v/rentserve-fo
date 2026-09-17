import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorListByCategory } from './favor-list-by-category';

describe('FavorListByCategory', () => {
  let component: FavorListByCategory;
  let fixture: ComponentFixture<FavorListByCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorListByCategory],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorListByCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
