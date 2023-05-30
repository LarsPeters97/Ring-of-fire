import { Component, inject } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getFirestore } from 'firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);
  db = getFirestore();
  gamesCollection = collection(this.firestore, 'games');
  game!: Game;
  constructor(private router: Router) {}

  newGame() {
    this.game = new Game();
    addDoc(this.gamesCollection, this.game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl(`/game/${gameInfo.id}`);
    });
  }
}
