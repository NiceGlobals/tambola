import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { Note } from './models/notification.model';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Game } from './models/game.model';
import { GameService } from './services/game.service';
import { FireService } from './services/fire.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  notification = new Note();
  endUser = new User();
  sideBarClass = false;
  logStatus;
  emailVerified: any = 'null';
  uid;
  games: Game[];
  gameCount = null;
  visitorsCount: number;
  user: Observable<firebase.User>;
  constructor(
    public _notes: NotificationService,
    private _router: Router,
    private _us: UserService,
    private _as: AuthService,
    private afAuth: AngularFireAuth,
    private _gs: GameService,
    private _fs: FireService) {
      this.afAuth.authState.subscribe(auth => {
        if (auth !== undefined && auth !== null) {
          this.uid = auth.uid;
          firebase.database().ref('mydb/users/' + this.uid).on('value', (snap) => {
            const data = snap.val();
            this.endUser = data;
            this.emailVerified = this.endUser.emailVerified;
            // console.log(this.emailVerified);
          });
        } else {
          this.emailVerified = 'undefined';
        }
        // if (auth !== undefined && auth !== null) {
        //   this.emailVerified = firebase.auth().currentUser.emailVerified;
        //   console.log('Email Verified:', auth.emailVerified);
        // } else {
        //   this.emailVerified = false;
        // }
      });
    // this.afAuth.authState.subscribe(auth => {
    //   if (auth !== undefined && auth !== null) {
    //     this.uid = auth.uid;
    //     this.endUser = this._us.getUserData();
    //   }
    // });
  }

  ngOnInit() {
    this.updateAnalytics();
    this.findGames();
    this.getVisits();
    this.endUser = this._us.getUserData();
    this._us.curUserUpdated.subscribe(
      (data) => {
        this.endUser = this._us.getUserData();
      }
    );
    this.user = this._as.authUser();
    this.notification.message = null;
    this._notes.noteChanged.subscribe(
      (note: any) => {
        this.notification = note;
        // console.log(this.notification);
      }
    );
  }
  routeToLogin() {
    this._router.navigate(['/login']);
  }

  w3_close() {
    this.sideBarClass = false;
  }
  w3_toggle() {
    this.sideBarClass = !this.sideBarClass;
  }

  logout() {
    const conf = confirm('Do you really want to logout?');
    if (conf) {
      this._as.logout();
      this._router.navigateByUrl('/login');
    }
  }

  findGames() {
    this.games = this._gs.getGames();
    if (this.games) {
      this.gameCount = 0;
    }
  }

  updateAnalytics() {
    const host = window.location.hostname;
    if (host !== 'localhost') {
      let aT = new Date().toDateString();
      let appName = navigator.appName;
      let appVersion = navigator.appVersion;
      let deviceType = navigator.userAgent;
      let anaUser = localStorage.getItem('afuid');
      if (anaUser == undefined) {
        anaUser = 'ananymous';
      }
      let anaData = {
        anaUser: anaUser,
        aT: aT,
        appName: appName,
        appVersion: appVersion,
        deviceType: deviceType
      }
      // console.log(anaData);
      this._fs.sendAnalytics(anaData);
    }
    console.log(host);
  }

  getVisits() {
    this._fs.getVisitorCount().on('value', (snap) => {
      this.visitorsCount = snap.val();
      // console.log(this.visitorsCount);
    }, (err) => {
      console.log(err.message);
    });
  }
}
