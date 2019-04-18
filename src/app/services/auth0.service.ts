import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class Auth0Service implements OnInit {
loggedin = false;

  constructor(private _router: Router, private _us: UserService ) {
    this._us.curUserUpdated.subscribe(
      (user: any) => {
        console.log('subscribed in Auth0');
        if (user != null) {
          this.logIn();
        } else {
          this.logOut();
        }
      }
    );
  }

  ngOnInit() {

  }
  getLogStatus() {
    return this.loggedin;
  }

  logIn() {
    console.log('logged in');
    this.loggedin = true;
  }

  logOut() {
    console.log('logged out');
    localStorage.setItem('cusr', null);
    this.loggedin = false;
  }
}
