import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialListByCategory } from './material-list-by-category';

describe('MaterialListByCategory', () => {
  let component: MaterialListByCategory;
  let fixture: ComponentFixture<MaterialListByCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialListByCategory],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialListByCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
