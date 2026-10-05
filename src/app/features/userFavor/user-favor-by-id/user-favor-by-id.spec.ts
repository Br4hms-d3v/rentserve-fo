import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorById } from './user-favor-by-id';

describe('UserFavorById', () => {
  let component: UserFavorById;
  let fixture: ComponentFixture<UserFavorById>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorById],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorById);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
