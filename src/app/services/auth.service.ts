import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { CurUser } from '../models/cuser.model';
import { AuthReq } from '../models/auth.request';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private basePath = '/mydb/users';
  authReq = new AuthReq();
  authReqChanged = new Subject<AuthReq>();

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private _router: Router ) {
    this.user = afAuth.authState;
  }

  login(user: User) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.afAuth.auth.signOut().then(
      () => {
        localStorage.setItem('afuid', 'ananymous');
      }
    );
  }

  authUser() {
    return this.user;
  }
  registerUser(user: User, cUser: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then(
      success => {
        // console.log(success);
        cUser.uid = success.uid;
        const uid = success.uid;
        // console.log(uid);
        // this.db.
        firebase.database().ref('/mydb/users/' + uid).set(cUser);
        // this.db.list(`${this.basePath}/${uid}`).set(cUser);
      }
    );
  }
  setDisplayName(name: string) {

  }

  reqAuth(id?: number) {
    if (id != null && id !== undefined) {
      this.authReq.authMethod = id;
    } else {
      this.authReq.authMethod = 0;
    }
    this.authReq.authMode = true;
    this.authReqChanged.next(this.authReq);
  }
}
