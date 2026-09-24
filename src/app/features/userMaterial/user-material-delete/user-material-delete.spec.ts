import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialDelete } from './user-material-delete';

describe('UserMaterialDelete', () => {
  let component: UserMaterialDelete;
  let fixture: ComponentFixture<UserMaterialDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
