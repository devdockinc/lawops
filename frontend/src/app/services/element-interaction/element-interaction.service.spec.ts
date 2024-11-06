import { TestBed } from '@angular/core/testing';

import { ElementInteractionService } from './element-interaction.service';

describe('ElementInteractionService', () => {
  let service: ElementInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
