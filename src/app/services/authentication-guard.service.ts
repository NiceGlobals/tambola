import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthenticationGuardService implements CanActivate {
  redirectUrl;
  user: Observable<firebase.User>;
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.user.map((auth) => {
      if (!auth) {
        let url: string = state.url;
        // console.log(`state url: ${state.url}`);
        this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
        return false;
      }
      return true;
    }).take(1);
  }
}
