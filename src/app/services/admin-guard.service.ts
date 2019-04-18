import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from './user.service';

@Injectable()
export class AdminGuardService implements CanActivate, CanActivateChild{
  user: Observable<firebase.User>;
  isAdmin: any = null;
  constructor(private afAuth: AngularFireAuth, private router: Router, private _us: UserService) {
    this.user = afAuth.authState;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.user.map((auth) => {
      // console.log('Admin-guard-0');
      if (!auth) {
        // console.log('Admin-guard-1');
        // console.log(`state url: ${state.url}`);
        this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
        return false;
      } else {
        // console.log('Admin-guard-2');
        this.isAdmin = this._us.isAdmin();
        // console.log('Admin-guard-2A: ' + this.isAdmin);
        if (this.isAdmin !== null && this.isAdmin !== undefined) {
          // console.log('Admin-guard-3');
          if (this.isAdmin) {
            return this.isAdmin;
          } else {
            this.router.navigate(['games']);
            return this.isAdmin;
          }
        } else {
          // console.log('Admin-guard-4: ' + this.isAdmin);
          setTimeout(() => {
            this.isAdmin = this._us.isAdmin();
            if (!this.isAdmin) {
              this.router.navigate(['games']);
            }
            // console.log('Admin-guard-5: ' + this.isAdmin);
            this.router.navigateByUrl(state.url);
            return this.isAdmin;
          }, 500);
        }
       }
    }).take(1);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    return this.canActivate(route, state);
  }
}


// console.log('Admin-guard-2');
// this.isAdmin = this._us.isAdmin();
// console.log('Admin-guard-2A: ' + this.isAdmin);
// if (this.isAdmin !== null && this.isAdmin !== undefined) {
//   console.log('Admin-guard-3');
//   if (this.isAdmin) {
//     return this.isAdmin;
//   }else {
//     this.router.navigate(['games']);
//     return this.isAdmin;
//   }
// } else {
//   console.log('Admin-guard-4: ' + this.isAdmin);
//   setTimeout(() => {
//     this.isAdmin = this._us.isAdmin();
//     if (!this.isAdmin) {
//       this.router.navigate(['games']);
//     };
//     console.log('Admin-guard-5: ' + this.isAdmin);
//     this.router.navigateByUrl(state.url);
//     return this.isAdmin;
//   }, 2000);
// }