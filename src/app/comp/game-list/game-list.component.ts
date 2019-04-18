import { Component, OnInit, Sanitizer } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameService } from '../../services/game.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { User } from '../../models/user.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../services/user.service';
import { FireService } from '../../services/fire.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Ticket } from '../../models/ticket.model';
import * as firebase from 'firebase';
import { Log } from '../../models/error.model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  ticket: any;
  uid: string;
  gamesLoaded = false;
  games: Game[];
  curGame: Game[] = [];
  completedGame: Game[] = [];
  selectedGame: Game;
  viewSt = 0;
  pState = 0;
  trustedUrl: SafeResourceUrl;
  gameSelected = false;
  emailVerified = false;
  time;
  tcNo: string;
  cUser = new User();
  fTicket = new Ticket();
  user: Observable<firebase.User>;
  constructor(
    private _gs: GameService,
    private sanitizer: DomSanitizer,
    private afAuth: AngularFireAuth,
    private _us: UserService,
    private _fs: FireService,
    private _as: AuthService,
    private _router: Router,
    private _ds: DataService
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
        firebase.database().ref('mydb/users/' + this.uid).on('value', (snap) => {
          const data = snap.val();
          this.cUser = data;
          this.emailVerified = this.cUser.emailVerified;
          console.log(this.emailVerified);
        });
      } else {
        this.emailVerified = false;
      }
      // if (auth !== undefined && auth !== null) {
      //   this.emailVerified = firebase.auth().currentUser.emailVerified;
      //   console.log('Email Verified:', auth.emailVerified);
      // } else {
      //   this.emailVerified = false;
      // }
    });
  }
  ngOnInit() {
    // this.cUser = this._us.getUserData();
    this.user = this._as.authUser();
    // this._us.curUserUpdated.subscribe(
    //   (data) => {
    //     this.cUser = this._us.getUserData();
    //     this.emailVerified = this.cUser.emailVerified;
    //     console.log(this.emailVerified);
        // console.log('123');
        // this.chkRegStat();
    //   }
    // );
    // console.log(this.cUser);
    this.getGames();
    // this.games = this._gs.getGames();
    // this._gs.gamesUpdated.subscribe(
    //   (games: Game[]) => {
    //     this.games = games;
    //   }
    // );
    if (this.games) {
      // console.log(this.games);
    }
    this.time = new Date().getTime();
  }

  selectGame(game: any) {
    if (game.gst < 1) {
      this.selectedGame = Object.assign({}, game);
      this.gameSelected = true;
      this.viewSt = 1;
      this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(game.tc);
      // this.selectedGame.registered = this.chkRegStat(this.selectedGame.gid);
      this.selectedGame.registered = this.checkTicketRegistered(this.selectedGame.gid);
    } else {
      this.viewGameResults(game.gid);
    }
    // console.log(this.selectedGame);
  }

  checkTicketRegistered(gid: string) {
    console.log('checking-started', gid);
    let reqData = false;
    if (this.emailVerified) {
      // console.log(this.cUser);
      let tickets: Ticket[] = this._ds.extractData(this.cUser.tickets);
      // console.log(tickets);

      for (let x = 0; x < tickets.length; x++) {
        // console.log(tickets[x][1]);
        if (tickets[x][1] === gid) {
          reqData = true;
        }
      }
    }
    return reqData;
  }

  resSelectGame() {
    this.selectedGame = null;
    this.gameSelected = false;
    this.viewSt = 0;
    this.ticket = null;
    this.pState = 0;
  }

  registerGame() {
    if (!this.selectedGame.registered) {
      this.viewSt = 2;
      this.getTicket();
    } else {
      this.redirToTicket();
    }
  }

  getTn() {
    this.viewSt = 3;
    const x = Math.random().toString(36).substr(2, 8).toUpperCase();
    this._fs.checkTicket(x).then(
      snap => {
        if (snap == null) {
          // console.log(x, 'ticket is unique');
          this.tcNo = x;
          // console.log(x);
          this.confTicket();
        } else {
          // console.log(x, 'ticket is not unique');
          this.getTn();
        }
      }
    ).catch(
      err => {
        console.log(err.message);
      }
    );
  }

  chkRegStat(gid?: string) {
    console.log('calling-reg-check');
    if (this.cUser != null && this.cUser !== undefined && this.cUser.tickets) {
      // console.log(this.cUser.tickets);
      let reqData = false;
      for (let x = 0; x < this.cUser.tickets.length; x++) {
        // console.log(this.cUser.tickets[x].indexOf(gid));
        if (this.cUser.tickets[x][1] === gid) {
          reqData = true;
        }
      }
      return reqData;
    } else {
      // console.log('User dont have any tickets');
      return false;
    }
  }
  getTicket() {
    const tick = this._gs.generateTicket();
    this.ticket = tick;
  }

  showData() {
    this._gs.showData();
  }
  reqLogin() {
    this._router.navigate(['/login'], {queryParams: {returnUrl: '/games'}});
  }

  confTicket() {
    this.fTicket.tid = this.tcNo;
    this.fTicket.gameid = this.selectedGame.gid;
    this.fTicket.gt = this.selectedGame.gt;
    this.fTicket.userid = this.cUser.uid;
    this.fTicket.tArr = this.ticket;
    this.fTicket.email = this.cUser.email;
    this.fTicket.userName = this.cUser.fname + ' ' + this.cUser.lname;
    this.fTicket.phone = this.cUser.phone;
    this.fTicket.tit = new Date().getTime();
    // console.log(this.fTicket);
    this._fs.uploadTicket(this.fTicket).then(
      snap => {
        // console.log(snap);
        // const tdata = {tno: this.fTicket.tid, gid: this.fTicket.gameid};
        const tdata = [this.fTicket.tid, this.fTicket.gameid, this.fTicket.gt];
        this._fs.updateTicketInUserData(tdata, this.fTicket.userid).then(
          snap2 => {
            // this.pState = 1;
            let data = {
              lType: 'success',
              lit: new Date().getTime(),
              data: {
                key: this.fTicket.email,
                Type: 'Ticket_registration',
                message: `Ticket registered successfully for ${this.fTicket.gameid}`
              }
            };
            this._fs.postLog(data);
            setTimeout(() => {
              this.redirectToNext();
            }, 2500);
          }
        ).catch(
          err => {
            console.log(err.message);
            let data = {
              lType: 'err',
              lit: new Date().getTime(),
              data: {
                key: this.fTicket.email,
                Type: 'Ticket_registration',
                message: `${err.message}, ${this.fTicket.gameid}`
              }
            };
            this._fs.postLog(data);
            setTimeout(() => {
              this.pState = 2;
            }, 2500);
          }
        );
      }
    ).catch(
      err => {
        console.log(err.message);
        this.pState = 2;
        setTimeout(() => {
          this.redirectToNext();
        }, 2500);
      }
    );
  }
  redirToTicket() {
    this._router.navigate(['/tickets' , this.selectedGame.gid]);
  }

  sendVerification() {
    firebase.auth().currentUser.sendEmailVerification().then(
      snap => {
        const eml = firebase.auth().currentUser.email;
        const message = 'Verification email has been sent to ' + eml + '.  Please login again after verification. In case if you dont find verification email in your inbox, please check once in spam folder.';
        let data = {
          lType: 'success',
          lit: new Date().getTime(),
          data: {
            key: `${firebase.auth().currentUser.email}`,
            Type: 'email_verification',
            message: message
          }
        }
        this._fs.postLog(data);
        alert(message);
        firebase.auth().signOut().then(
          (snap: any) => {
            this.reqLogin();
          }
        );
      }
    ).catch(
      err => {
        const errMsg = 'Ooops!, Some error occured, unable to send verification link, please try again later.';
        alert(errMsg);
        console.log(err.message);
        let data = {
          lType: 'err',
          lit: new Date().getTime(),
          data: {
            key: `${firebase.auth().currentUser.email}`,
            Type: 'email_verification',
            message: err.message
          }
        }
        this._fs.postLog(data);
      }
    );
  }

  redirectToNext() {
    setTimeout(() => {
      this.pState = 1;
    }, 2500);
    setTimeout(() => {
      this.redirToTicket();
      this.resSelectGame();
    }, 6500);
  }

  getConvertedDate(date: any) {
    let dt = new Date(date).toLocaleString('en-US', { timeZone: 'America/Atikokan' }) + ' CST';
    return dt;
  }

  viewGameResults(gid: string) {
    this._router.navigateByUrl('/games/game_results/' + gid);
  }

  getGames() {
    firebase.database().ref('/mydb/games/').on('value', (snap) => {
      this.curGame = [];
      this.completedGame = [];
      // console.log(snap.val());
      if (snap.val() !== null && snap.val() !== undefined) {
        this.games = this._ds.extractData(snap.val());
        for (let x = 0; x < this.games.length; x++) {
          if (this.games[x].gst > 1) {
            this.completedGame.push(this.games[x]);
          } else {
            if (this.games[x].showPublic) {
              this.curGame.push(this.games[x]);
            }
          }
        }
        this.completedGame = this.completedGame.reverse();
        this.gamesLoaded = true;
        // console.log(this.curGame, this.completedGame);
      }
    });
  }

}
