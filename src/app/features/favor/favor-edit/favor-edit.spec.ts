import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorEdit } from './favor-edit';

describe('FavorEdit', () => {
  let component: FavorEdit;
  let fixture: ComponentFixture<FavorEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
