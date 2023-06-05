import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { gameData } from '../game-date.service';
import { IsGameOverService } from '../is-game-over.service';
import { Game } from 'src/models/game';
import { Router } from '@angular/router';
import { doc, setDoc } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent implements OnChanges {
  cardAction = [
    {
      title: 'Waterfall',
      description:
        'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking. Player 3 may stop as soon as player 2 stops drinking, and so on.',
    },
    { title: 'You', description: 'You decide who drinks' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    {
      title: 'Category',
      description:
        'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.',
    },
    {
      title: 'Bust a jive',
      description:
        'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one. ',
    },
    { title: 'Chicks', description: 'All girls drink.' },
    {
      title: 'Heaven',
      description: 'Put your hands up! The last player drinks!',
    },
    {
      title: 'Mate',
      description:
        'Pick a mate. Your mate must always drink when you drink and the other way around.',
    },
    {
      title: 'Thumbmaster',
      description:
        'You can determine when you press your thumb on the edge of the table. The others must follow suit as quickly as possible. The last player to press his thumb on the edge of the table must drink.',
    },
    { title: 'Men', description: 'All men drink.' },
    {
      title: 'Quizmaster',
      description:
        'The quizmaster may ask a question at any time and any player who answers the question incorrectly must drink or fulfill a penalty. The quizmaster has the authority to set the questions and the penalties.',
    },
    {
      title: 'Never have i ever...',
      description:
        'Say something you never did. Everyone who did it has to drink.',
    },
    {
      title: 'Rule',
      description:
        'Make a rule. Everyone needs to drink when he breaks the rule.',
    },
  ];
  db = getFirestore();
  title: string = '';
  description: string = '';
  @Input() card: any;
  amountPlayers!: number;
  players: Array<string> = [];
  isGameOver: boolean = false;

  constructor(
    private gameData: gameData,
    private isGameOverService: IsGameOverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gameData.amountPlayers.subscribe(
      (amountPlayers) => (this.amountPlayers = amountPlayers)
    );
    this.gameData.players.subscribe(
      (players: Array<string>) => (this.players = players)
    );
    this.isGameOverService.isGameOver.subscribe(
      (isGameOver) => (this.isGameOver = isGameOver)
    );
  }

  ngOnChanges(): void {
    if (this.card) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }
  }

  restartGame() {
    let oldGameId = this.router.url.split('/')[2];
    let newGame = new Game();
    newGame.players = this.players;
    let docRef = doc(this.db, 'games', oldGameId);
    let newGameData = newGame.toJson();
    setDoc(docRef, newGameData);
  }
}
