import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDelete } from './material-delete';

describe('MaterialDelete', () => {
  let component: MaterialDelete;
  let fixture: ComponentFixture<MaterialDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
