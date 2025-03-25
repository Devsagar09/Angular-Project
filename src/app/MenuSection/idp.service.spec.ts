import { TestBed } from '@angular/core/testing';

import { IdpService } from './idp.service';

describe('IdpService', () => {
  let service: IdpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
