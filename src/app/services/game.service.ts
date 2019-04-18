import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Game } from '../models/game.model';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { DataService } from './data.service';
import { Subject } from 'rxjs/Subject';
import { Ticket } from '../models/ticket.model';

@Injectable()
export class GameService implements OnInit {
  z1 = null;
  games: Game[];
  tickets: Ticket[];
  gamesUpdated = new Subject<Game[]>();
  comb1;
  comb2;
  comb3;
  array90 = [];
  array902 = [];
  finalCol = [];
  ticket = [[], [], []];
  comb = [
    [0, 0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 1, 0, 1, 1, 0, 1, 1],
    [0, 0, 1, 0, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 0, 1, 1],
    [0, 0, 1, 1, 0, 1, 1, 0, 1],
    [0, 0, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 1],
    [0, 0, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 1, 1, 0, 1],
    [0, 1, 0, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 1, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 1],
    [0, 1, 0, 1, 0, 1, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 0, 0, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0, 1, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 1],
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 1],
    [0, 1, 1, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0, 0, 1],
    [0, 1, 1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 1],
    [0, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 1, 0],
    [1, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 1, 0, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 0],
    [1, 0, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 1, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 1, 0],
    [1, 1, 0, 0, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 0, 1, 0],
    [1, 1, 0, 0, 1, 1, 1, 0, 0],
    [1, 1, 0, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 0, 1, 1, 0],
    [1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 1, 0, 0],
    [1, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 0, 0],
    [1, 1, 0, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 0, 1, 0, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 1, 0],
    [1, 1, 1, 0, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0]
    ];

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private _ds: DataService) {
    this.gen90();
  }

  ngOnInit() {
    this.getGames2();
  }

  generateTicket() {
    this.resetData();
    this.gen90();
    this.array902 = this.getAr90();
    this.z1 = Math.floor(Math.random() * 126);
    // this.z1 = Math.floor(Math.random() * (60 - 45 + 1)) + 45;
    // console.log(this.z1);
    if (this.z1 < 40) {
      this.comb1 = this.comb[this.z1];
      this.comb2 = this.comb[+this.z1 + 15];
      this.comb3 = this.comb[+this.z1 + 75];
   }
   if (this.z1 >= 40 && this.z1 <= 80) {
      this.comb1 = this.comb[this.z1];
      this.comb2 = this.comb[+this.z1 - 15];
      this.comb3 = this.comb[+this.z1 + 45];
   }
   if (this.z1 > 80) {
      this.comb1 = this.comb[this.z1];
      this.comb2 = this.comb[+this.z1 - 15];
      this.comb3 = this.comb[+this.z1 - 10];
   }
  //  console.log(this.comb1, this.comb2, this.comb3);
   this.finalCol[0] = this.comb1;
   this.finalCol[1] = this.comb2;
   this.finalCol[2] = this.comb3;
  //  console.log('Final Col:', this.finalCol);
   for (let x = 0; x < this.finalCol.length; x++) {
     for (let y = 0; y < this.finalCol[x].length; y ++) {
      const za = this.finalCol[x][y];
      if (za !== 0) {
        const ran = Math.floor(Math.random() * (this.array902[y].length - 1));
        const za1 = this.array902[y][ran];
        // this.ticket[x][y] = za1;
        this.ticket[x].push(za1);
        const ranIndex = this.array902[y].indexOf(za1);
        // console.log('ran:', ran, 'y:', y, this.array902[y].length);
        // console.log('ranIndex', ranIndex);
        // console.log('z', za, za1);
        // console.log('y=', y, y % 9);
        this.array902[y].splice(ran, 1);
      } else {
        this.ticket[x].push(0);
      }
     }
    //  console.log('break');
    // console.log('902:', this.array902);
   }
  //  console.log('Ticket is:', this.ticket);
   const tmptckt1 = this.ticket.slice(0);
   this.sortTicket(tmptckt1);
  //  this.array902.splice(0, 1);
  //  console.log(this.array90);
  //  console.log(this.array902);
   return(this.ticket.slice(0));
  }

  resetData() {
    this.finalCol = [];
    this.comb1 = [];
    this.comb2 = [];
    this.comb3 = [];
    this.ticket = [[], [], []];
    this.array902 = this.array90.slice();
 }

 gen90() {
  for (let i = 0; i < 9; i++) {
     const x = (10 * i) + 1;
     const carr = [];
     for (let j = x ; j < (+x + 10); j++) {
        carr.push(j);
        // console.log(j);
     }
     // console.log('it');
     this.array90[i] = carr;
  }
  // console.log(this.array90);
}

  getAr90() {
    return this.array90.slice();
  }

  showData() {
    // console.log('Array90:', this.array90);
    // console.log('Final Col:', this.finalCol);
    // console.log(this.z1);
  }

  sortTicket(ticket: any) {
    let tmpTicket = ticket;
    for (let y = 0; y < tmpTicket[0].length; y++) {
      let a1 = [tmpTicket[0][y], tmpTicket[1][y], tmpTicket[2][y]];
      // console.log(a1);
      if (a1[0] === 0 && a1[1] !== 0 && a1[2] !== 0) {
        let a2 = [a1[1], a1[2]];
        a2 = a2.sort((a , b) => this.sortFunc(a, b));
        a1[1] = a2[0];
        a1[2] = a2[1];
        // console.log(a1);
      }
      if (a1[0] !== 0 && a1[1] === 0 && a1[2] !== 0) {
        let a2 = [a1[0], a1[2]];
        a2 = a2.sort((a , b) => this.sortFunc(a, b));
        a1[0] = a2[0];
        a1[2] = a2[1];
        // console.log(a1);
      }
      if (a1[0] !== 0 && a1[1] !== 0 && a1[2] === 0) {
        let a2 = [a1[0], a1[1]];
        a2 = a2.sort((a , b) => this.sortFunc(a, b));
        a1[0] = a2[0];
        a1[1] = a2[1];
        // console.log(a1);
      }
      if (a1[0] !== 0 && a1[1] !== 0 && a1[2] !== 0) {
        let a2 = [a1[0], a1[1], a1[2]];
        a2 = a2.sort((a , b) => this.sortFunc(a, b));
        a1 = a2;
        // console.log(a1);
      }
      tmpTicket[0][y] = a1[0];
      tmpTicket[1][y] = a1[1];
      tmpTicket[2][y] = a1[2];
    }
    // console.log('Sorted Ticket:', tmpTicket);
  }

  sortFunc(a: number, b: number) {
    return a - b;
  }

  getGames() {
    // console.log('fetching games 1');
    if (this.games) {
    return this.games;
   } else {
     this.getGames2();
    // firebase.database().ref('mydb/games').once('value').then(
    //   (span) => {
    //     const dt = this._ds.extractData(span);
    //     return dt;
    //   }
    // ).catch(
    //   err => {
    //     console.log(err.message);
    //     return null;
    //   }
    // );
   }
  }

  getGames2() {
    // console.log('games fetch start');
    firebase.database().ref('mydb/games').on('value', (snap) => {
      const dt = this._ds.extractDataWithKeys(snap.val());
      this.games = dt.reverse();
      this.gamesUpdated.next(this.games.slice());
    });
  }

  getGame(gid: string) {
    if (this.games) {
      let game;
      for ( let x = 0; x < this.games.length; x++) {
        if (this.games[x].gid === gid) {
          game = this.games[x];
        }
      }
      return game;
    } else {
      return null;
    }
  }

  setTickets(tickets: any) {
    // console.log('null');
  }
}

