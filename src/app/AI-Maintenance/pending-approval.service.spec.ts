import { TestBed } from '@angular/core/testing';

import { PendingApprovalService } from './pending-approval.service';

describe('PendingApprovalService', () => {
  let service: PendingApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
