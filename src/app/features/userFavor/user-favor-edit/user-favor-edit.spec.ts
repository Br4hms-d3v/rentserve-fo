import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorEdit } from './user-favor-edit';

describe('UserFavorEdit', () => {
  let component: UserFavorEdit;
  let fixture: ComponentFixture<UserFavorEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
