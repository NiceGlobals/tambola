import { Component, OnInit } from '@angular/core';
import { Game, Sponcer } from '../../../models/game.model';
import { GameService } from '../../../services/game.service';
import { FireService } from '../../../services/fire.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent implements OnInit {
trustedUrl: SafeResourceUrl;
games: Game[];
state = 0;
selectedGame: Game;
finGame = new Game();
newGame = new Game();
prizes = [
  {p1: '1<sup>st</sup> Full House:', p2: 100, p3: 1},
  {p1: '2<sup>nd</sup> Full House:', p2: 50, p3: 2},
  {p1: 'Fast Five / Jaldi Five:', p2: 25, p3: 3},
  {p1: 'First Row:', p2: 25, p3: 4},
  {p1: 'Second Row:', p2: 25, p3: 5},
  {p1: 'Third Row:', p2: 25, p3: 6}
];
winners = {
  ff: {
    claimed: false,
    ticket: false,
    claimtime: false,
    serial: false,
    winnername: false,
    winneremail: false
  },
  fr: {
    claimed: false,
    ticket: false,
    claimtime: false,
    serial: false,
    winnername: false,
    winneremail: false
  },
  sr: {
    claimed: false,
    ticket: false,
    claimtime: false,
    serial: false,
    winnername: false,
    winneremail: false
  },
  tr: {
    claimed: false,
    ticket: false,
    claimtime: false,
    serial: false,
    winnername: false,
    winneremail: false
  },
  fh1: {
    claimed: false,
    ticket: false,
    claimtime: false,
    serial: false,
    winnername: false,
    winneremail: false,
    photoUrl: false
  },
  fh2: {
    claimed: false,
    ticket: false,
    claimtime: false,
    serial: false,
    winnername: false,
    winneremail: false,
    photoUrl: false
  }
};
sponcers: Sponcer[] = [
  {logo: 'null' , bannerLg: 'null', bannerMd: 'null', bannerSm: 'null', redirectLink: 'null'}
];

gameSubmitted = false;
editMode = false;
  constructor(
    private _gs: GameService,
    private _fs: FireService,
    private sanitizer: DomSanitizer,
    private _router: Router
  ) { }

  ngOnInit() {
    this.newGame.tc = './assets/t_and_c/terms_1.html';
    this.newGame.gst = 0;
    this.newGame.winners = this.winners;
    this.newGame.sponcers = this.sponcers;
    this.games = this._gs.getGames();
    this._gs.gamesUpdated.subscribe(
      (games: Game[]) => {
        this.games = games;
      }
    );
  }

  createNewGame() {
    this.state = 1;
  }
  selGame(game: Game) {
    this.state = 2;
    this.selectedGame = Object.assign({}, game);
    this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedGame.tc);
  }

  resSate() {
    if (this.state === 1 && this.selectedGame) {
      this.state = 2;
      this.editMode = false;
    } else {
      this.state = 0;
      this.selectedGame = null;
    }
    this.newGame = new Game();
    this.newGame.tc = './assets/t_and_c/terms_1.html';
    this.newGame.gst = 0;
    this.finGame = new Game();
    this.gameSubmitted = false;
    this.editMode = false;
  }

  editGame() {
    this.state = 1;
    this.newGame = this.selectedGame;
    // this.newGame.sponcers = this.sponcers;
    // this.newGame.winners = this.winners;
    if (!this.newGame.sponcers) {
      this.newGame.sponcers = this.sponcers;
    }
    if (!this.newGame.winners) {
      this.newGame.winners = this.winners;
    }
    this.editMode = true;
  }
  saveGame() {
    this.finGame = this.newGame;
    this.gameSubmitted = true;
    this.dateUpdated();
    this.genGameData();
    // console.log(this.finGame);
    // console.log('svae game clicked');
    if (!this.editMode) {
      this._fs.addGame(this.finGame).then(
        snap => {
          console.log(snap.val());
          this.resSate();
          alert('Game Added Successfylly.');
        }
      ).catch(
        err => {
          console.log(err.message);
          alert('Some Error Occured, Please try again later.');
        }
      );
    }

    if (this.editMode) {
      console.log('Game in edit Mode');
      this._fs.updateGame(this.finGame).then(
        snap => {
          // console.log(snap);
          this.resSate();
          alert('Game Updated Successfylly.');
        }
      ).catch(
        err => {
          console.log(err.message);
          alert('Some Error Occured, Please try again later.');
        }
      );
    }
  }
  genGameData() {
    this.finGame.pnum = [];
    for (let x = 1; x <= 90; x++) {
      this.finGame.pnum.push({num: x, picked: false, serial: 0});
    }
    this.finGame.prizes = this.prizes;
    console.log(this.finGame);
  }

  dateUpdated() {
    if (this.newGame.gt != null && this.newGame.gt !== undefined) {
      this.finGame.gt = new Date(this.newGame.gt).getTime();
    }
    if (this.newGame.st != null && this.newGame.st !== undefined) {
      this.finGame.st = new Date(this.newGame.st).getTime();
    }
    if (this.newGame.et != null && this.newGame.et !== undefined) {
      this.finGame.et = new Date(this.newGame.et).getTime();
    }
  }

  startGame(gid: string) {
    // console.log('start game selected');
    this._router.navigateByUrl('/admin/game_mode/' + gid);
  }

  viewResults(gid: string) {
    this._router.navigateByUrl('/games/game_results/' + gid);
  }
}
