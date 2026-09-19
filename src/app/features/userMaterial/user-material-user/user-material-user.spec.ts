import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialUser } from './user-material-user';

describe('UserMaterialUser', () => {
  let component: UserMaterialUser;
  let fixture: ComponentFixture<UserMaterialUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialUser],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
