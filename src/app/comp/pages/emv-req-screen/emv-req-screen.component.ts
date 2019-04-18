import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../../models/user.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-emv-req-screen',
  templateUrl: './emv-req-screen.component.html',
  styleUrls: ['./emv-req-screen.component.css']
})
export class EmvReqScreenComponent implements OnInit {
uid: string;
cUser = new User();
rsDisable = false;
timeleft = 0;
waitingCompleted = true;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
        firebase.database().ref('mydb/users/' + this.uid).on('value', (snap) => {
          const data = snap.val();
          this.cUser = data;
          // console.log(this.cUser);
        });
      }
    });
  }

  ngOnInit() {
  }

  resendEMV() {
    this.rsDisable = true;
    if (this.waitingCompleted) {
      let rsObj = {email: this.cUser.email, uid: this.cUser.uid, fname: this.cUser.fname};
      firebase.database().ref('/mydb/resendEMV/').push(rsObj).then(
        snap => {
          // console.log(snap);
          alert('Verification email will be sent to your inbox soon. also please check in spam folder if required.');
          this.resetRSbutton();
        }
      ).catch(err => {
        console.log('email verification mail failed to send');
        alert('Ooops...!, Something went wrong, Please try again later.');
        setTimeout(() => {
          this.rsDisable = false;
        }, 15000);
      });
    }
  }

  resetRSbutton() {
    this.timeleft = 90;
    this.waitingCompleted = false;
    let timecontrol = setInterval(() => {
      this.timeleft = this.timeleft - 1;
      if (this.timeleft < 1) {
        this.rsDisable = false;
        this.timeleft = 90;
        this.waitingCompleted = true;
        clearInterval(timecontrol);
      }
    }, 1000);
    // setTimeout(() => {
    //   this.rsDisable = false;

    // }, 10000);
  }

  getMinutes(v) {
    let mm = Math.floor(v / 60);
    let ss: any = v % 60;
    if (ss < 10) {
      ss = '0' + ss;
    }
    return '0' + mm + ':' + ss;
  }
}
