import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialCreate } from './user-material-create';

describe('UserMaterialCreate', () => {
  let component: UserMaterialCreate;
  let fixture: ComponentFixture<UserMaterialCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
