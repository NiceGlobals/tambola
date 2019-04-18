import { Injectable } from '@angular/core';
import { FireUploadObj } from '../models/fire-upload.model';
import * as  firebase from 'firebase';

@Injectable()
export class FirebaseUploadService {

  constructor() {}

  uploadThis(obj: FireUploadObj) {
    console.log(obj);
    const storageRef = firebase.storage().ref(`${obj.path}`);
    const uploadTask = storageRef.child(`${obj.fileName}`).put(obj.file);
    return uploadTask;
    // return null;
  }

}
