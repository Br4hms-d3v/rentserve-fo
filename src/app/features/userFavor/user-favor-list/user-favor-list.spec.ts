import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorList } from './user-favor-list';

describe('UserFavorList', () => {
  let component: UserFavorList;
  let fixture: ComponentFixture<UserFavorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorList],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
