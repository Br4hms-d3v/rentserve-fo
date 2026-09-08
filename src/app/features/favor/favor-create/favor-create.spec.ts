import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorCreate } from './favor-create';

describe('FavorCreate', () => {
  let component: FavorCreate;
  let fixture: ComponentFixture<FavorCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
