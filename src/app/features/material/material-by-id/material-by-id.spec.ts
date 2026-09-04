import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialById } from './material-by-id';

describe('MaterialById', () => {
  let component: MaterialById;
  let fixture: ComponentFixture<MaterialById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialById],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
