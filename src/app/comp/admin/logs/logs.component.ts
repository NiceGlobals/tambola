import { Component, OnInit } from '@angular/core';
import { FireService } from '../../../services/fire.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
logs: any[];
mode = 0;
  constructor(private _fs: FireService, private _ds: DataService) { }

  ngOnInit() {
    this.getLogs(this.mode);
  }

  getLogs(mode?: number) {
    this.mode = mode;
    this._fs.getLogs(this.mode).on('value', (snap) => {
      if (snap.val() != null && snap.val() !== undefined ) {
        const dt = snap.val();
        // console.log(snap.val());
        let logs2 = this._ds.extractData(dt);
        this.logs = logs2.reverse();
        // console.log(this.logs);
      } else {
        this.logs = null;
      }
    })
  }

  getDateConverted(date: any) {
    return this._ds.getConvertedDate(date);
  }

}
