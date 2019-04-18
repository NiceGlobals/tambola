import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AssetMapService {
  sponsors = firebase.database().ref(`/mydb/sponsors`);
  constructor() { }

  getassetURL(assetKey: string, uid: string) {
    if (assetKey === 'sponsor-logo') {
      return this.sponsors.child(uid).child('logoUrl').once('value');
    }
    if (assetKey === 'sponsor-banners') {
      return this.sponsors.child(uid).child('banners').once('value');
    }
    if (assetKey === 'sponsor-banners-blg') {
      return this.sponsors.child(uid).child('banners').child('blg').once('value');
    }
    if (assetKey === 'sponsor-banners-bmd') {
      return this.sponsors.child(uid).child('banners').child('bmd').once('value');
    }
    if (assetKey === 'sponsor-banners-bsm') {
      return this.sponsors.child(uid).child('banners').child('bsm').once('value');
    }
  }

}
