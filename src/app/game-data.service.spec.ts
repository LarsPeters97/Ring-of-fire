import { TestBed } from '@angular/core/testing';

import { gameData } from './game-date.service';

describe('AmoutPlayersService', () => {
  let service: gameData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(gameData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
