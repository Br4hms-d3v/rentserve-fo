import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEdit } from './material-edit';

describe('MaterialEdit', () => {
  let component: MaterialEdit;
  let fixture: ComponentFixture<MaterialEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
