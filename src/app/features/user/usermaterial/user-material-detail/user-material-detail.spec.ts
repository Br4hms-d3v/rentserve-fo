import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMaterialDetail } from './user-material-detail';

describe('UserMaterialDetail', () => {
  let component: UserMaterialDetail;
  let fixture: ComponentFixture<UserMaterialDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMaterialDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMaterialDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
