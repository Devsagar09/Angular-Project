import { TestBed } from '@angular/core/testing';

import { TraningService } from './training.service';

describe('TraningService', () => {
  let service: TraningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
