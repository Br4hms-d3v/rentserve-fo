import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorUser } from './user-favor-user';

describe('UserFavorUser', () => {
  let component: UserFavorUser;
  let fixture: ComponentFixture<UserFavorUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorUser],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
