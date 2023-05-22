import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getFirestore } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: any;
  game!: Game;
  firestore: Firestore = inject(Firestore);
  db = getFirestore();
  game$: Observable<any[]>;
  gamesCollection = collection(this.firestore, 'games');
  gameId!: string;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.game$ = collectionData(this.gamesCollection);
  }

  async ngOnInit() {
    this.newGame();
    this.route.params.subscribe((param) => {
      this.gameId = param['id'];
      let docRef = doc(this.gamesCollection, this.gameId);
      // console.log(docRef);
      let game$ = docData(docRef);
      // console.log(game$);

      game$.subscribe((game: any) => {
        console.log(game);
        this.updateGameData(game);
      });
    });
  }

  updateGameData(game: any) {
    this.game.currentPlayer = game.currentPlayer;
    this.game.playedCard = game.playedCard;
    this.game.players = game.players;
    this.game.stack = game.stack;
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        // this.saveGame();
      }
    });
  }

  saveGame() {
    let docRef = doc(this.gamesCollection, this.gameId);
    let gameData = this.game.toJson();
    setDoc(docRef, gameData);
  }
}
