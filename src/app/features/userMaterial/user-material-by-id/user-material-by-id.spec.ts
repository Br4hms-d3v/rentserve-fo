import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialById } from './user-material-by-id';

describe('UserMaterialById', () => {
  let component: UserMaterialById;
  let fixture: ComponentFixture<UserMaterialById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialById],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
