import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FireService } from '../../../services/fire.service';
import { Game } from '../../../models/game.model';
import { CanComponentDeactivate } from '../../../services/can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DataService } from '../../../services/data.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-game-mode',
  templateUrl: './game-mode.component.html',
  styleUrls: ['./game-mode.component.css']
})
export class GameModeComponent implements OnInit, CanComponentDeactivate {
  endUser = new User();
  isAdmin = false;
  waiting = true;
  vState = 0;
  gameCantFind = false;
  gameInitiated = false;
  currentGame: Game = null;
  selectedGame: Game = null;
  allowedToLeave: boolean = true;
  stateMessage = 'Processing';
  errMessage = 'Ooops! some error occured. Game cannot be loaded.';
  gameArray = [];
  gameId = null;
  disablePick = false;
  dialText: any = 'Click Here';
  currentPickedNumber: any = null;
  serialCount = 0;
  checkClose = false;
  // fft = null; first row ticket
  // wfft = null; Winner first row ticket
  fft: Ticket = new Ticket();
  // wfft = null;
  frt: Ticket = new Ticket();
  // wfrt = null;
  srt: Ticket = new Ticket();
  // wsrt = null;
  // wtrt = null;
  trt: Ticket = new Ticket();
  // wfht1 = null;
  fht1: Ticket = new Ticket();
  // wfht2 = null;
  fht2: Ticket = new Ticket();
  of: Ticket = new Ticket();
  constructor(
    private _us: UserService,
    private _router: Router,
    private _fs: FireService,
    private _route: ActivatedRoute,
    private _ds: DataService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.trackParam();
    // this.setGameArray();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.allowedToLeave) {
      return true;
    } else {
      return confirm('Do you really want to leave, you may loose Game data!');
    }
  }

  setGameArray() {
    for (let x = 1; x <= 90; x++) {
      this.gameArray.push(x);
    }
    // console.log(this.gameArray);
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
      this.currentGame = this.selectedGame;
      this.adjustGameData();
      if (!this.gameInitiated) {
        this.currentGame = this.selectedGame;
        this.checkGame();
        // this.adjustGameData();
      } else {
        // console.log('');
      }
    }, (err) => {
      console.log(err.message);
    });
  }

  checkGame() {
    // console.log('Game Checking');
    const curTime = new Date().getTime();
    this.stateMessage = 'Preparing the game Environment';
    // console.log((this.currentGame.gt - 1800000) < curTime );
    // 14400000 => game availability time set to 4 Hrs from start time
    if (this.currentGame.gst > 1 || (curTime > (this.currentGame.gt + 14400000))) {
      this.errMessage = 'This game is already completed or timed out.';
      this.showError();
    } else {
      this.vState = 2;
    }
    if ((this.currentGame.gt - 1800000) > curTime) {
      this.errMessage = 'You are not allowed to start the game at this moment. please try to start on or 30 Min before schedule time.';
      this.showError();
    }
  }

  adjustGameData() {
    this.gameArray = [];
    this.serialCount = -1;
    for (let x = 0; x < this.currentGame.pnum.length ; x++) {
      const id = this.currentGame.pnum[x];
      const wd = this.currentGame.winners;
      if (!id.picked) {
        this.gameArray.push(1 + x);
      }
      if (id.serial >= this.serialCount) {
        this.serialCount = id.serial;
      }
      // if (wd.ff.claimed) {
      //   this.fft = wd.ff.ticket;
      // }
      if (wd.ff.claimed) {
        this.fft = wd.ff.ticket;
      }
      if (wd.fr.claimed) {
        this.frt = wd.fr.ticket;
      }
      if (wd.sr.claimed) {
        this.srt = wd.sr.ticket;
      }
      if (wd.tr.claimed) {
        this.trt = wd.tr.ticket;
      }
      if (wd.fh1.claimed) {
        this.fht1 = wd.fh1.ticket;
      }
      // if (wd.fh2.claimed) {
      //   this.fht2 = wd.fh2.ticket;
      // }
      // if (wd.of.claimed) {
      //   this.of = wd.of.ticket;
      // }
    }
    // console.log(this.serialCount);
    // console.log(this.gameArray);
  }

  initGame() {
    if (this.currentGame.gst < 1) {
      let conf = confirm('Do you really want to start the game ?, Once the game is initiated it can not be reset.');
      if (conf) {
        this.allowedToLeave = false;
        this.gameInitiated = true;
        this._fs.updateGameState(1, this.gameId)
        .then()
        .catch(err => console.log(err.message));
      }
    } else {
      this.allowedToLeave = false;
      this.gameInitiated = true;
    }
  }

  submitPick() {
    this.gameArray.splice(this.currentPickedNumber, 1);
    // console.log(this.gameArray);
    this.currentPickedNumber = null;
    let gameRef = firebase.database().ref(`mydb/games/${this.gameId}/pnum/${this.dialText - 1}`);
    gameRef.update({picked: true, serial: this.serialCount}).then(
      (snap) => {
        // console.log(snap);
        this.disablePick = false;
        if (
          this.currentGame.winners.ff.claimed
          && this.currentGame.winners.fr.claimed
          && this.currentGame.winners.sr.claimed
          && this.currentGame.winners.tr.claimed
          && this.currentGame.winners.fh1.claimed
          && this.currentGame.winners.fh2.claimed
          && this.currentGame.winners.of.claimed
          && !this.checkClose) {
            this.checkCloseGame();
        }

        if (this.gameArray.length < 1) {
          this.closeGame();
        }
      }
    ).catch((err) => console.log(err.message));
  }

  pickNumber() {
    if (this.serialCount == 90) {
      this.closeGame();
      return;
    }
    this.serialCount = this.serialCount + 1;
    this.disablePick = true;
    let countUp = setInterval(() => {
      this.countUp();
    }, 35);
    setTimeout(() => {
      clearInterval(countUp);
      this.currentPickedNumber = Math.floor(Math.random() * this.gameArray.length);
      this.dialText = this.gameArray[this.currentPickedNumber];
      // console.log(this.currentPickedNumber, this.dialText);
    }, 4000);
  }

  countUp() {
    this.dialText = Math.floor(Math.random() * 90);
  }

  closeGame() {
    this._fs.updateGameState(2, this.gameId).then(
      () => {
        this.vState = 3;
        this.allowedToLeave = true;
      }
    );
  }

  updateWinner(pt: string, ticket: string) {
    const entryTime = new Date().getTime();
    const serial = this.serialCount;
    let ticketData, FTD;
    this._fs.checkTicket(ticket).then(
      (snap) => {
        ticketData = this._ds.extractData(snap)[0];
        console.log(ticketData);
        FTD = {
          claimed: true,
          claimtime: new Date().getTime(),
          serial: this.serialCount,
          ticket: ticketData,
          winneremail: ticketData.email,
          winnername: ticketData.userName,
          winnerId: ticketData.userid
        };
        console.log(FTD);
        this._fs.updateWinners(this.gameId , pt, FTD).then(
          snap => {
            // console.log(snap);
          }
        ).catch(err => console.log(err, err.message));
      }
    ).catch(
      err => console.log(err, err.message)
    );
  }

  checkCloseGame() {
    this.checkClose = true;
    const conf = confirm('All Prizes Alloted, Want to close the game?');
    if (conf) {
      this.confirmClose(true);
    }
  }

  confirmClose(e?: boolean) {
    if (e) {
      this.closeGame();
    } else {
      const conf = confirm('Do you really want to close the game?');
      if (conf) {
        this.closeGame();
      }
    }
  }

  // checkCanEnableClose() {
  //   if (
  //     this.currentGame.winners.ff.claimed
  //     && this.currentGame.winners.fr.claimed
  //     && this.currentGame.winners.sr.claimed
  //     && this.currentGame.winners.tr.claimed
  //     && this.currentGame.winners.fh1.claimed
  //     && this.currentGame.winners.fh2.claimed
  //     && this.currentGame.winners.of.claimed) {
  //       return false;
  //   } else {
  //     return true;
  //   }
  // }
  checkCanEnableClose() {
    if (
      this.currentGame.winners.ff.claimed
      && this.currentGame.winners.fr.claimed
      && this.currentGame.winners.sr.claimed
      && this.currentGame.winners.tr.claimed
      && this.currentGame.winners.fh1.claimed) {
        return false;
    } else {
      return true;
    }
  }

}
