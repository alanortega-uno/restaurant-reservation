import { TestBed } from '@angular/core/testing';

import { TableStatusService } from './table-status.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TableStatusService', () => {
  let service: TableStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TableStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
