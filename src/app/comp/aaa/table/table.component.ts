import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
@Input('data-array') InputArray;
@Input('data-config') dataConf;
  constructor() { }

  ngOnInit() {
    console.log(this.dataConf, this.InputArray);
  }

}
