import { Component, OnInit } from '@angular/core';
import { FireService } from '../../services/fire.service';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Log } from '../../models/error.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
formState = 0;
email;
fname;
lname;
password;
phone;
emailVerified;
userkey;
loading = false;
check = true;
loginError;
loginErrorMsg;
user = new User();
uid;
tmpUser: User;
returnUrl: string;
cUser: Observable<firebase.User>;

  constructor(
    private _fire: FireService,
    private _ds: DataService,
    private _us: UserService,
    private _router: Router,
    private _as: AuthService,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth) {
      this.afAuth.authState.subscribe(auth => {
        if (auth !== undefined && auth !== null) {
          this.uid = auth.uid;
          this.navigateTodef();
        }
      });
    }

  ngOnInit() {
    this._as.logout();
    let navigationExtras: NavigationExtras = {
      queryParamsHandling: 'preserve',
      // preserveFragment: true
    };
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    console.log(`returnUrl: ${this.returnUrl}`);
  }

  submitForm(form?: any, fKey?: any) {
    this.loading = true;
    this.loginError = false;
    this.loginErrorMsg = null;
    // console.log(form);
    this.email = this.email.toLowerCase();
    if (fKey === 'f1') {
      this.checkEmail(this.email, fKey);
    }
    if (fKey === 'f2') {
      this.user.email = this.email;
      this.user.fname = this.fname;
      this.user.lname = this.lname;
      this.user.phone = this.phone;
      this.emailVerified = false;
      this.user.tickets = null;
      this.user.utype = 'euser';
      this.user.emailVerified = false;
      this.user.dateOfRegister = new Date().getTime();
      const usr = {email: this.email, password: this.password};
      // console.log(this.user, usr);
      this._as.registerUser(usr, this.user).then(
        () => {
          // this.sendEmailVerification();
          alert('An email with verification link has been sent to your registered email');
          this.navigateTodef();
        }
      ).catch(
        (lErr) => {
          console.log(lErr.message);
          const logData = {
            lit: new Date().getTime(),
            lType: 'err',
            data: {errType: 'auth', message: lErr.message, email: this.email}
          };
          this._fire.postLog(logData);
          this.loginErrorMsg = lErr.message;
          this.loginError = true;
          this.formState = 0;
          this.loading = false;
        }
      );
      // this._fire.pushUser(this.user).then(
      //   (snap) => {
      //     this.checkEmail(this.email);
      //   }
      // );
    }
    if (fKey === 'f3') {
      const usr = {email: this.email, password: this.password};
      this._as.login(usr).then(
        (data: any) => {
          // console.log(data);
          this._fire.getCUser(data.uid).then(
            (snap) => {
              this.tmpUser = snap;
              // console.log(this.tmpUser);
              this._us.setCurUser(snap);
              // this.setVerificationStatus(data, this.tmpUser);
              this.navigateTodef();
            }
          );
        }
      ).catch(
        lErr => {
          console.log(lErr.message, lErr.name);
          const logData = {
            lit: new Date().getTime(),
            lType: 'err',
            data: {Type: 'auth', message: lErr.message, email: this.email}
          };
          this._fire.postLog(logData);
          this.loginErrorMsg = lErr.message;
          this.loginError = true;
          this.formState = 0;
          this.loading = false;

        }
      );
    }
  }

  navigateTodef() {
    // this._router.navigateByUrl('/games');
    console.log('navigateTodef called, return Url: ' + this.returnUrl);
    if (!this.returnUrl || this.returnUrl == undefined) {
      this._router.navigateByUrl('games');
    } else {
      this._router.navigateByUrl(this.returnUrl);
    }

  }

  checkEmail(email: string, fkey?: string) {
    this._fire.checkEmail(email).then(
      snap => {
        if (snap != null) {
          this.loading = false;
          this.formState = 2;
        } else {
          this.loading = false;
          this.formState = 1;
        }
      }
    ).catch(err => {
      this.resForm();
    });
  }

  resForm() {
    this.formState = 0;
    this.loading = false;
    this.email = '';
    this.fname = '';
    this.lname = '';
    this.userkey = '';
    this.loginError = false;
    this.loginErrorMsg = null;
  }

  sendEmailVerification() {
    const curUser = firebase.auth().currentUser;
    const mailObject = {uid: curUser.uid, email: curUser.email, emailSent: false};
    firebase.database().ref('mydb/mails/emailVerification').push(mailObject).then(
      snap => {
        firebase.auth().currentUser.sendEmailVerification().then(
          snap2 => {
            console.log('Email sent for Verification');
            let data = {
              lType: 'info',
              lit: new Date().getTime(),
              data: {
                key: `${firebase.auth().currentUser.email}`,
                Type: 'email_verification',
                message: `Email verification sent to ${this.email}.`
              }
            };
            this._fire.postLog(data);
            alert('An email with verification link has been sent to your registered email');
            // this._as.logout();
          }
        ).catch(
          err => {
            console.log('Failed to send email verification');
            console.log('Error:' + err.message);
            let data = {
              lType: 'err',
              lit: new Date().getTime(),
              data: {
                key: `${firebase.auth().currentUser.email}`,
                Type: 'email_verification',
                message: err.message
              }
            };
            this._fire.postLog(data);
          }
        );
      }
    ).catch(
      err => {
        console.log('Failed to send email verification');
        console.log('Error:' + err.message);
        const data = {
          lType: 'err',
          lit: new Date().getTime(),
          data: {
            key: `${firebase.auth().currentUser.email}`,
            Type: 'email_verification',
            message: err.message
          }
        };
        this._fire.postLog(data);
      }
    );
  }

  sendPwdReset() {
    firebase.auth().sendPasswordResetEmail(this.email).then(
      (snap) => {
        console.log('Password reset email sent successfully');
        const data = {
          lType: 'info',
          lit: new Date().getTime(),
          data: {
            key: this.email,
            Type: 'password_reset_email',
            message: `password reset email sent to ${this.email}`
          }
        };
        this._fire.postLog(data);
        alert('Password reset email sent successfully');
      }
    ).catch(
      (err) => {
        console.log(err.message);
        const data = {
          lType: 'err',
          lit: new Date().getTime(),
          data: {
            key: this.email,
            Type: 'password_reset_email',
            message: err.message
          }
        };
        this._fire.postLog(data);
        alert('some error occured, please check your email or try again later');
      }
    );
  }


  setVerificationStatus(data: any, user: User) {
    if (data.emailVerified && !user.emailVerified) {
      this._fire.updateUserVerification(data.uid, true).then(
        snap => {
          console.log('User verification status updated successfully');
          console.log(snap);
        }
      );
    }
  }
}
