import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorDetail } from './user-favor-detail';

describe('UserFavorDetail', () => {
  let component: UserFavorDetail;
  let fixture: ComponentFixture<UserFavorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
