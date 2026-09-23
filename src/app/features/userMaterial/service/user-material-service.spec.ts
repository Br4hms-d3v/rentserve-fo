import { TestBed } from '@angular/core/testing';

import { UserMaterialService } from './user-material-service';

describe('UserMaterialService', () => {
  let service: UserMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
