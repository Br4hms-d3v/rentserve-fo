import { TestBed } from '@angular/core/testing';

import { FavorService } from './favor-service';

describe('FavorService', () => {
  let service: FavorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
