import { Injectable } from '@angular/core';
import { Note } from '../models/notification.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotificationService {
note = new Note();
noteChanged = new Subject<Note>();
timeOut = null;
  constructor() { }

  setNote(msg: string, type: string) {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    this.note.message = msg;
    if (!type) {
      this.note.noteType = 'info';
    } else {
      this.note.noteType = type;
    }
    this.noteChanged.next(this.note);
    this.timeOut = setTimeout(() => {
      this.note.noteType = null;
      this.note.message = null;
      this.noteChanged.next(this.note);
    }, 10000);
  }

  clearNote() {
    this.note.message = null;
    this.note.noteType = null;
    this.noteChanged.next(this.note);
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }
}
