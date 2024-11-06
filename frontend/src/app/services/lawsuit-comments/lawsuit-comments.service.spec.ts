import { TestBed } from '@angular/core/testing';

import { LawsuitCommentsService } from './lawsuit-comments.service';

describe('LawsuitCommentsService', () => {
  let service: LawsuitCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LawsuitCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
