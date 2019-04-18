import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FireService } from '../../services/fire.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  endUser = new User();
  isAdmin: any = 'checking';
  waiting = true;
  constructor(
    private _us: UserService,
    private _router: Router,
    private _fs: FireService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.endUser = this._us.getUserData();
    if (this.endUser !== null && this.endUser !== undefined) {
      this.checkIsAdmin();
    }
    this._us.curUserUpdated.subscribe(
      (data) => {
        this.endUser = this._us.getUserData();
        this.checkIsAdmin();
      }
    );
  }

  checkIsAdmin() {
     if (this._us.isAdmin()) {
      this.isAdmin = true;
    } else {
      this._router.navigateByUrl('/games');
    }
  }
}
