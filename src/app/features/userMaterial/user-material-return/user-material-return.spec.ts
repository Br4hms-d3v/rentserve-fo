import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialReturn } from './user-material-return';

describe('UserMaterialReturn', () => {
  let component: UserMaterialReturn;
  let fixture: ComponentFixture<UserMaterialReturn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialReturn],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialReturn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
