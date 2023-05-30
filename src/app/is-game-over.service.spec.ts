import { TestBed } from '@angular/core/testing';

import { IsGameOverService } from './is-game-over.service';

describe('IsGameOverService', () => {
  let service: IsGameOverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsGameOverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
