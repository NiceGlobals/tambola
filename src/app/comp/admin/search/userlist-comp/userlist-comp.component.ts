import { Component, OnInit } from '@angular/core';
import { FireService } from '../../../../services/fire.service';
import { DataService } from '../../../../services/data.service';
import * as firebase from 'firebase';
import { User } from '../../../../models/user.model';
import * as _ from 'lodash';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-userlist-comp',
  templateUrl: './userlist-comp.component.html',
  styleUrls: ['./userlist-comp.component.css']
})
export class UserlistCompComponent implements OnInit {
  userList: User[] = [];
  filteredUsers: User[] = [];
  selectedUserGids: any[] = [];
  selectedUsers: User[] = [];
  userListMessage = 'Currently no data to display';
  pageSize = 10;
  page = 1;
  collectionSize = this.userList.length;
  constructor(
    private _fs: FireService,
    private _ds: DataService
  ) {}

  ngOnInit() {
    this.userListMessage = 'Please wait, Fetching users from database';
    firebase.database().ref(`/mydb/users`).on('value', snap => {
      // console.log(snap.val());
      const extData = this._ds.extractDataWithKeys(snap.val());
      this.userList = this.getSortedUsersList(extData);
      this.filteredUsers = extData;
      // this.getListOfVerifiedEmails(extData);
    }, err => {console.log(err); this.userListMessage = 'Something went wrong...!, Unable to display right now.'});
  }

  getListOfVerifiedEmails(data: User[]) {
  console.log(data);
   const verUsers =  _.filter(data, (user: User) => user.emailVerified);
   console.log(verUsers);
  }

  get users(): User[] {
    return this.filteredUsers
    .map((user, i) => ({id: i + 1, ...user}))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  getSortedUsersList(users: User[]) {
    return _.orderBy(users, ['dateOfRegister'], ['desc']);
  }

  exportData(data: User[]) {
    const options = {
      showLabels: true,
      showTitle: false,
      headers: ['Sno', 'User name', 'Email address', 'Phone No', 'Email verified']
    };
    const Data = [];
    _.forEach(data, (user, i) => {
      const dataObj = {
        Sno: i + 1,
        username: user.fname + user.lname,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified
      };
      Data.push(dataObj);
    });

    const dataz = new Angular2Csv(Data, `Tambola_userslist_as_on_${new Date()}`, options);
  }

  filterList(search: string) {
    // console.log(search);
    const key = search.toLowerCase();
    this.filteredUsers = this.userList.filter((user: User) => ((user.fname + ' ' + user.lname).toLowerCase().match(key)
    || user.fname.toLowerCase().match(key) || user.lname.toLowerCase().match(key) || user.email.toLowerCase().match(key)
    || user.phone.toLowerCase().match(key) || (user.emailVerified + '').match(key)));
    this.filteredUsers = this.getSortedUsersList(this.filteredUsers);
  }

  selectThisUser(i: any) {
    const tmpID = this.selectedUserGids[i.gid];
    if (tmpID !== true) {
      this.selectedUsers.push(i);
      this.selectedUserGids[i.gid] = true;
    } else {
      this.selectedUsers.splice(this.getIndexOfSelUser(i.gid), 1);
      delete this.selectedUserGids[i.gid];
    }
  }

  getIndexOfSelUser(gid: string): any {
    _.forEach(this.selectedUsers, (user: any, i) => {
      if (user.gid === gid) {
        return i;
      }
    });
  }

  checkAll() {
    if (this.selectedUsers.length < this.users.length) {
      this.deselectAll();
      _.forEach(this.users, (i: any) => {
        this.selectedUsers.push(i);
        this.selectedUserGids[i.gid] = true;
      });
    } else {
      this.deselectAll();
    }
  }

  deselectAll() {
    this.selectedUsers = [];
    this.selectedUserGids = [];
  }

}
