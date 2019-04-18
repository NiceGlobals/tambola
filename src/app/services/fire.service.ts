import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { User } from '../models/user.model';
import { promise } from 'protractor';
import { Subject } from 'rxjs/Subject';
import { Ticket } from '../models/ticket.model';
import { Game } from '../models/game.model';
import { HttpClient } from '@angular/common/http';
import { Log } from '../models/error.model';

@Injectable()
export class FireService {
  private uid: string;
  fdb = firebase.database();
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private _http: HttpClient) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
      }
    });
  }

  getCUser(uid: string) {
    return this.fdb.ref('mydb/users/' + uid).once('value')
    .then((snap) => snap.val());
  }

  checkEmail(email: string) {
    return firebase.database().ref('mydb/users').orderByChild('email').equalTo(email).once('value').then(
      snap => snap.val()
    );
  }

  checkTicket(tid: string) {
    return firebase.database().ref('mydb/tickets').orderByChild('tid').equalTo(tid).once('value').then(
      snap => snap.val()
    );
  }

  pushUser(_user: User) {
    const user = _user;
    return firebase.database().ref('mydb/users').push(user).once('value');
  }

  updateUserVerification(uid: string, state: boolean) {
    return firebase.database().ref(`mydb/users/${uid}/emailVerified`).set(state);
  }

  uploadTicket(ticket: Ticket) {
    return firebase.database().ref('mydb/tickets').push(ticket).once('value');
  }

  updateTicketInUserData(ticketData: any, uid: string) {
    return firebase.database().ref('mydb/users/' + uid + '/tickets').push(ticketData).once('value').then(
      snap => snap.val()
    );
  }

  addGame(game: Game) {
    return firebase.database().ref('mydb/games').push(game).once('value');
  }

  getGame(uid: string) {
    return firebase.database().ref('mydb/games/' + uid);
  }

  updateGame(game: Game) {
    return firebase.database().ref('mydb/games/' + game.gid).set(game);
  }

  updateGameState(st: number, gid: string) {
    return firebase.database().ref(`mydb/games/${gid}/gst`).set(st);
  }

  sendEmailVerificationLink() {
    firebase.auth().currentUser.sendEmailVerification().then(
      snap => {
        console.log('Email sent for Verification');
        alert('An email with verification link has sent to your registered email');
      }
    ).catch(
      err => {
        console.log('Failed to send email verification');
        console.log('Error:' + err.message);
      }
    );
  }

  getTickets(): Observable<Ticket[]> {
    return this.db.list('mydb/tickets');
  }

  getGames(): Observable<Game[]> {
    return this.db.list('mydb/games');
  }

  getGames2() {
    return firebase.database().ref('/mydb/games/').on('value', (snap) => (snap.val()));
  }

  sendTcf(mail: string, uname: string, ticket: string, gt: any) {
    const url = `https://us-central1-chennai-shopping-jewellery.cloudfunctions.net/triggerTicketEmail
    ?email=${mail}&uname=${uname}&ticket=${ticket}&gt=${gt}`;
    console.log(`mail: ${mail}, uname: ${uname}, ticket: ${ticket}, gt: ${gt}`);
    return null;
    // return this._http.get(url);
  }

  sendAnalytics(anaData: any) {
    // console.log(anaData);
    const visitorRef = firebase.database().ref('mydb/analytics').child('visits');
    firebase.database().ref('mydb/analytics/anaDt').push(anaData)
    .then((snap) => {
      visitorRef.transaction((visits) => {
        return visits + 1;
      });
    });
  }

  // getAnalytics() {
  //   return firebase.database().ref('mydb/analytics').on('value', (snap) => snap.val());
  // }

  getVisitorCount() {
    return firebase.database().ref('/mydb/analytics/visits');
  }

  getStat() {
    return firebase.database().ref('/mydb/stats');
  }

  postLog(data: any) {
    const db = firebase.database();
    if (data.lType == 'err') {
      db.ref('/mydb/logs/errors').push(data);
    }

    if (data.lType == 'info') {
      db.ref('/mydb/logs/info').push(data);
    }

    if (data.lType == 'success') {
      db.ref('/mydb/logs/success').push(data);
    }
    if (data.lType == 'warn') {
      db.ref('/mydb/logs/warnings').push(data);
    }
  }

  pushStat(id: number) {
    const db = firebase.database();
    if (id == 0) {
      return db.ref('/mydb/stats/').child('games').transaction((count) => {
        return count + 1;
      });
    }
    if (id == 1) {
      return db.ref('/mydb/stats/').child('tickets').transaction((count) => {
        return count + 1;
      });
    }
    if (id == 2) {
      return db.ref('/mydb/stats/').child('users').transaction((count) => {
        return count + 1;
      });
    }
  }

  gameCount(id: string) {
    const db = firebase.database().ref(`/mydb/games/${id}`);
    db.child('count').transaction((count) => {
      return count + 1;
    });
  }

  getLogs(code: number) {
    if (code === 0) {
      return firebase.database().ref('/mydb/logs/errors');
    }
    if (code === 1) {
      return firebase.database().ref('/mydb/logs/warnings');
    }
    if (code === 2) {
      return firebase.database().ref('/mydb/logs/success');
    }
    if (code === 3) {
      return firebase.database().ref('/mydb/logs/info');
    }
  }

  updateWinners(gid: string, pt: string, ticket: any) {
    return firebase.database().ref(`mydb/games/${gid}/winners/${pt}`).set(ticket);
  }

  getAllSpnsors() {
    return firebase.database().ref(`/mydb/sponsors`);
  }

}

