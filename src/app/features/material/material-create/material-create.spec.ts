import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCreate } from './material-create';

describe('MaterialCreate', () => {
  let component: MaterialCreate;
  let fixture: ComponentFixture<MaterialCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
