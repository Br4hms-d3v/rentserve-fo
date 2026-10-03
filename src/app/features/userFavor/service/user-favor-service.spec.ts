import { TestBed } from '@angular/core/testing';

import { UserFavorService } from './user-favor-service';

describe('UserFavorService', () => {
  let service: UserFavorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFavorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
