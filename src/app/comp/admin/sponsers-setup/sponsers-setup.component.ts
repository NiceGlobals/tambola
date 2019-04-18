import { Component, OnInit, OnDestroy } from '@angular/core';
import { Sponsor } from '../../../models/sponsor.model';
import { DataService } from '../../../services/data.service';
import * as firebase from 'firebase';
import { FileOutput } from '../../aaa/file-input/file.model';
import { FirebaseUploadService } from '../../../services/firebase-upload.service';
import { FireUploadObj } from '../../../models/fire-upload.model';
import { Subject } from 'rxjs';
import { AbstractControl, NgForm } from '@angular/forms';
import { FireService } from '../../../services/fire.service';

@Component({
  selector: 'app-sponsers-setup',
  templateUrl: './sponsers-setup.component.html',
  styleUrls: ['./sponsers-setup.component.css']
})
export class SponsersSetupComponent implements OnInit, OnDestroy {
  sponsors: Sponsor[] = [];
  sponsersSubscribe;
  selSponsor: Sponsor;
  sponsorsListMessage = 'No records found to display';
  sponsorsUrl = '/mydb/sponsors';
  formHiddenVal = 0;
  viewMode = 0;
  pageSize = 15;
  page = 1;
  editMode = false;
  uploadPending = 0;
  uploadCompleted = 0;
  onUploadPendingUpdate = new Subject<boolean>();
  formSubmitted = false;
  formInvalid = true;
  editModeData = [false, false, false, false, false];
  tmpFiles = [[null, null, null, null], [null, null, null, null]];
  constructor(
    private _ds: DataService,
    private _us: FirebaseUploadService,
    private _fs: FireService
  ) { }

  ngOnInit() {
    console.log('sponsors looking');
    this.sponsorsListMessage = 'Loading, PLease wait';
    this._fs.getAllSpnsors().on('value', snap => {
      // console.log(snap);
      if (snap.val() !== null) {
        this.sponsors = this._ds.extractDataWithKeys(snap.val());
        console.log(this.sponsors);
      } else {
        this.sponsors = [];
        this.sponsorsListMessage = 'No records found to display';
      }
    }, err => {
      console.log(err);
      this.sponsorsListMessage = 'Something went wrong, Unable to fetch data';
    });
  }

  onSubmit(form) {
    console.log(form);
    console.log(this.selSponsor);
    const conf = confirm('Do you really want to save the sponsor?');
    if (conf) {
      this.formSubmitted = true;
      if (this.editMode) {
        this.followFileUpload(this.selSponsor.gid);
      } else {
        console.log(this.selSponsor);
        this.submitSponsor(this.selSponsor);
      }
    }
    // firebase.database().ref(`${this.sponsorsUrl}`).push()
  }

  submitSponsor(sponsor: Sponsor) {
    console.log(sponsor);
    firebase.database().ref(`${this.sponsorsUrl}`).push(sponsor).then(snap => {
      console.log(snap.key);
      this.selSponsor.gid = snap.key;
      this.followFileUpload(snap.key);
    }).catch(err => console.log(err));
  }

  followFileUpload(uid: string) {
    this.checkUploadStatus(uid);
    for (let i = 0; i < this.tmpFiles[0].length; i++) {
      if (this.tmpFiles[1][i] !== null) {
        this.updateUploadPending(1);
      }
    }
    if (this.uploadPending < 1) {
      this.updateAfterFollow(uid);
    } else {
      for (let i = 0; i < this.tmpFiles[0].length; i++) {
        if (this.tmpFiles[1][i] !== null) {
          const obj = {
            file: this.tmpFiles[0][i],
            fileName: i + '.' + this.getFileNameExtension(this.tmpFiles[0][i].name),
            path: `/sponsors/${uid}/`
          };
          const storageRef = firebase.storage().ref(`${obj.path}`);
          const uploadTask = storageRef.child(`${obj.fileName}`).put(obj.file);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
              let progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
              progress = Math.trunc(progress);
              console.log(i, progress);
            },
            (err) => console.log(err), () => {
              const downloadUrl = uploadTask.snapshot.downloadURL;
              console.log(downloadUrl);
              if (this.assignDownloadUrl(i, downloadUrl)) {
                this.updateUploadPending(0);
              }
          });
        }
      }
    }
  }

  updateUploadPending(i: number) {
    if (i === 1) {
      this.uploadPending++;
    } else {
      this.uploadCompleted++;
    }
    this.onUploadPendingUpdate.next(this.uploadPending === this.uploadCompleted);
  }

  checkUploadStatus(uid: string) {
    this.onUploadPendingUpdate.subscribe(boo => {
      if (boo) {
        this.updateAfterFollow(uid);
      }
    });
  }

  updateAfterFollow(uid: string) {
    console.log('called for update');
    this.updateSponsor(uid).then(() => {
      alert('Sponsor saved successfully');
      this.resState();
    }).catch(err => alert('Failed to save the sponser data. please try again later'));
  }

  updateSponsor(uid: string) {
    return firebase.database().ref(`${this.sponsorsUrl}/${uid}`).set(this.selSponsor);
  }

  assignDownloadUrl(i: number, url: string) {
    if (i === 0) { this.selSponsor.logoUrl = url;  return true; }
    if (i === 1) { this.selSponsor.banners.blg = url; return true; }
    if (i === 2) { this.selSponsor.banners.bmd = url; return true; }
    if (i === 3) { this.selSponsor.banners.bsm = url; return true; }
    return null;
  }

  onFileSelect(i: number, event: FileOutput, myForm: NgForm) {
    this.tmpFiles[0][i] = event.file;
    this.tmpFiles[1][i] = event.buffer;
    this.editModeData[i] = true;
    console.log(this.tmpFiles);
    myForm.form.markAsDirty();
    this.verifyFormSubmit();
  }

  resState() {
    this.selSponsor = new Sponsor();
    this.editMode = false;
    this.uploadPending = 0;
    this.uploadCompleted = 0;
    this.viewMode = 0;
    this.formSubmitted = false;
  }

  newSponsor() {
    this.selSponsor = new Sponsor();
    this.viewMode = 1;
    this.verifyFormSubmit();
  }

  editThisSponsor(sponsor: Sponsor) {
    this.selSponsor = Object.assign({}, sponsor);
    this.editMode = true;
    this.viewMode = 1;
    this.verifyFormSubmit();
  }

  getFileNameExtension(name: string) {
    const strArr = name.split('.');
    return strArr[strArr.length - 1];
  }

  verifyFormSubmit() {
    let tempInvalid = false;
    for (let i = 0; i < this.tmpFiles[1].length; i++) {
      if (!this.editMode && this.tmpFiles[1][i] === null) {
        tempInvalid = true;
      }
    }
    this.formInvalid = tempInvalid;
  }

  ngOnDestroy() {

  }
}
