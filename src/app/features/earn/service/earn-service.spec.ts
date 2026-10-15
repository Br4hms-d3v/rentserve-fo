import { TestBed } from '@angular/core/testing';

import { EarnService } from './earn-service';

describe('EarnService', () => {
  let service: EarnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EarnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
