import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { User } from '../models/user.model';
import { DataService } from './data.service';

@Injectable()
export class UserService {
  uid: string;
  curUserUpdated = new Subject<User[]>();
  curUser: User;
  fdb = firebase.database();
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private _ds: DataService) {
    // this.curUser = new User();
    // this.curUser.utype = 'euser';
    // console.log(this.curUser);
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
        this.fdb.ref('mydb/users/' + this.uid).on('value', (snap) => {
          const data = snap.val();
          this.setCurUser(data);
        });
      } else {
        this.curUser = null;
        localStorage.setItem('afuid', 'ananymous');
      }
    });
   }

   isAdmin() {
     if (this.curUser) {
      return (this.curUser.utype === 'myadmin');
     } else {
       return undefined;
     }
   }

   getUserData() {
     return this.curUser || null;
   }
   setCurUser(data: any) {
     this.curUser = new User();
     this.curUser = data;
     setTimeout(() => {
      if (this.curUser.tickets && this.curUser.tickets !== null && this.curUser.tickets !== undefined) {
        this.curUser.tickets = this._ds.extractData(this.curUser.tickets);
        this.curUser.tickets = this.curUser.tickets.reverse();
      } else {
        this.curUser.tickets = null;
      }
      localStorage.setItem('afuid', this.uid);
     //  console.log(this.curUser);
      this.curUserUpdated.next(data);
     }, 500);
   }
}
