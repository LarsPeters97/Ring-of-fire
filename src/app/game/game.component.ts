import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { gameData } from '../game-date.service';
import { IsGameOverService } from '../is-game-over.service';
import { DialogEditPlayerComponent } from '../dialog-edit-player/dialog-edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  game!: Game;
  firestore: Firestore = inject(Firestore);
  db = getFirestore();
  game$: Observable<any[]>;
  gamesCollection = collection(this.firestore, 'games');
  gameId!: string;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private gameData: gameData,
    private isGameOverService: IsGameOverService
  ) {
    this.game$ = collectionData(this.gamesCollection);
  }

  async ngOnInit() {
    this.newGame();
    this.route.params.subscribe((param) => {
      this.gameId = param['id'];
      let docRef = doc(this.gamesCollection, this.gameId);
      let game$ = docData(docRef);
      game$.subscribe((game: any) => {
        this.updateGameData(game);
        this.triggerServices();
      });
    });
  }

  updateGameData(game: any) {
    this.game.currentPlayer = game.currentPlayer;
    this.game.playedCard = game.playedCard;
    this.game.players = game.players;
    this.game.stack = game.stack;
    this.game.pickCardAnimation = game.pickCardAnimation;
    this.game.currentCard = game.currentCard;
    this.game.isGameOver = game.isGameOver;
  }

  triggerServices() {
    this.gameData.triggerPlayerAmountSubject(this.game.players.length);
    this.gameData.triggerPlayerSubject(this.game.players);
    this.isGameOverService.triggerIsGameOverSubject(this.game.isGameOver);
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.atLeastTwoPlayers()) {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop()!;
        this.checkGameOver();
        this.game.pickCardAnimation = true;
        this.changeCurrentPlayerFocus();
        this.saveGame();
        setTimeout(() => this.drawnCardBecomesAPlayedCard(), 1000);
      }
    } else this.openDialog();
  }

  atLeastTwoPlayers() {
    return this.game.players.length > 1;
  }

  drawnCardBecomesAPlayedCard() {
    this.game.playedCard.push(this.game.currentCard);
    this.game.pickCardAnimation = false;
    this.saveGame();
  }

  changeCurrentPlayerFocus() {
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
  }

  checkGameOver() {
    if (this.game.stack.length === 0) {
      setTimeout(() => {
        this.game.isGameOver = true;
        this.saveGame();
      }, 5000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((playerData: any) => {
      if (playerData) {
        this.game.players.push(playerData);
        this.saveGame();
      }
    });
  }

  saveGame() {
    let docRef = doc(this.gamesCollection, this.gameId);
    let gameData = this.game.toJson();
    setDoc(docRef, gameData);
  }

  editPlayer(playerNumber: number) {
    const dialogRef = this.dialog.open(DialogEditPlayerComponent, {
      data: {
        name: this.game.players[playerNumber].name,
        selectedImage: this.game.players[playerNumber].selectedImage,
      },
    });
    this.actionsAfterDialogGetsClosed(dialogRef, playerNumber);
  }

  actionsAfterDialogGetsClosed(
    dialogRef: MatDialogRef<DialogEditPlayerComponent, any>,
    playerNumber: number
  ) {
    dialogRef.afterClosed().subscribe((playerData: any) => {
      if (playerData === 'Delete') {
        this.game.players.splice(playerNumber, 1);
        this.changeCurrentPlayerFocus();
      } else if (playerData) this.game.players[playerNumber] = playerData;
      this.saveGame();
    });
  }
}
