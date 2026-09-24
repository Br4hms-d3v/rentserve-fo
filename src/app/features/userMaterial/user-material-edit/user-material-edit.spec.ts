import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialEdit } from './user-material-edit';

describe('UserMaterialEdit', () => {
  let component: UserMaterialEdit;
  let fixture: ComponentFixture<UserMaterialEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
