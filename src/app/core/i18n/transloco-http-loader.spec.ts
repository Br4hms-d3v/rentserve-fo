import { TestBed } from '@angular/core/testing';

import { TranslocoHttpLoader } from './transloco-http-loader';

describe('TranslocoHttpLoader', () => {
  let service: TranslocoHttpLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslocoHttpLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
