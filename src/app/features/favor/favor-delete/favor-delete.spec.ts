import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorDelete } from './favor-delete';

describe('FavorDelete', () => {
  let component: FavorDelete;
  let fixture: ComponentFixture<FavorDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorDelete],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
