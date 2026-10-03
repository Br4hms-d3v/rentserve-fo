import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorCreate } from './user-favor-create';

describe('UserFavorCreate', () => {
  let component: UserFavorCreate;
  let fixture: ComponentFixture<UserFavorCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFavorCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
