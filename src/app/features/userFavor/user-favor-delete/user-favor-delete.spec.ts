import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorDelete } from './user-favor-delete';

describe('UserFavorDelete', () => {
  let component: UserFavorDelete;
  let fixture: ComponentFixture<UserFavorDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
