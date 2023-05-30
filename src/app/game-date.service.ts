import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class gameData {
  amountPlayers = new Subject<number>();
  players = new Subject<Array<string>>();

  constructor() {}

  triggerPlayerAmountSubject(amountPlayers: number) {
    this.amountPlayers.next(amountPlayers);
  }

  triggerPlayerSubject(players: Array<string>) {
    this.players.next(players);
  }
}
