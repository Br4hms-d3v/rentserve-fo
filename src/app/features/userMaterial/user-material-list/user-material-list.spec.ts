import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialList } from './user-material-list';

describe('UserMaterialList', () => {
  let component: UserMaterialList;
  let fixture: ComponentFixture<UserMaterialList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialList],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
