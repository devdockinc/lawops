import { TestBed } from '@angular/core/testing';

import { LawsuitActivitiesService } from './lawsuit-activities.service';

describe('LawsuitActivitiesService', () => {
  let service: LawsuitActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LawsuitActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
