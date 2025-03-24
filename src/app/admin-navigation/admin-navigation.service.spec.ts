import { TestBed } from '@angular/core/testing';

import { AdminNavigationService } from './admin-navigation.service';

describe('AdminNavigationService', () => {
  let service: AdminNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
