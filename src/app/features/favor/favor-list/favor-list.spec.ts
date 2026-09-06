import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorList } from './favor-list';

describe('FavorList', () => {
  let component: FavorList;
  let fixture: ComponentFixture<FavorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorList],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
