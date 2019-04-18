import { Component, OnInit } from '@angular/core';
import { Game, Sponcer } from '../../../models/game.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FireService } from '../../../services/fire.service';
import { DataService } from '../../../services/data.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.css']
})
export class GameResultsComponent implements OnInit {
  stateMessage = 'Processing';
  selectedGame: Game = null;
  selectedGameSponcers: Sponcer[] = null;
  vState = 0;
  sound = new Audio();
  gameId = null;
  gameCantFind = false;
  gameInitiated = false;
  selectedSponcer: Sponcer = null;
  sponcerId = 0;
  lastCount = 0;
  errMessage = 'Ooops! some error occured. Game cannot be loaded.';
  constructor(
    // private _us: UserService,
    private _router: Router,
    private _fs: FireService,
    private _route: ActivatedRoute,
    private _ds: DataService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.trackParam();
  }


  trackParam() {
    if (this._route.snapshot.params['id']) {
      this.gameId = this._route.snapshot.params['id'];
      this.setCurGame(this.gameId);
      // console.log(gameId);
    } else {
      console.log('no_game_selected');
      this.showError();
    }
  }
  showError() {
    this.gameCantFind = true;
    this.vState = 1;
  }

  setCurGame(gameId: string) {
    this.stateMessage = 'Fetching the selected game';
    this._fs.getGame(gameId).on('value', (snap) => {
      // console.log(snap.val());
      this.selectedGame = snap.val();
      if (this.selectedGame.gst < 1) {
        this.errMessage = 'Game not started, please check the game start time.';
        this.showError();
      } else {
        this.gameInitiated = true;
        this.vState = 2;
        this.sayGame();
      }
    }, (err) => {
      console.log(err.message);
    });

    firebase.database().ref('mydb/games/' + gameId + '/sponcers').on('value', (snap2) => {
      // console.log(snap2.val());
      this.selectedGameSponcers = this._ds.extractData(snap2.val());
      this.manageSponcers();
      // console.log(this.selectedGameSponcers);
    });
  }

  sayGame() {
    this.sound.src = './assets/sounds/to-the-point.mp3';
    this.sound.play();
    for (let x = 0; x < this.selectedGame.pnum.length; x++) {
      if (this.lastCount <= this.selectedGame.pnum[x].serial) {
        this.lastCount = this.selectedGame.pnum[x].serial;
        // console.log(this.lastCount);
      }
    }
  }

  manageSponcers() {
    if (this.selectedGameSponcers) {
      setInterval(() => {
        if (this.sponcerId  < (this.selectedGameSponcers.length - 1)) {
          this.sponcerId = this.sponcerId + 1;
        } else {
          this.sponcerId = 0;
        }
        // console.log(this.sponcerId);
        // this.selectedSponcer = this.selectedGame.sponcers[this.sponcerId];
      }, 7500);
    }
  }
}
