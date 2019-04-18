import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileOutput } from './file.model';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.css']
})
export class FileInputComponent implements OnInit {
  @Input('data-set') dataSet;
  @Input('data-label') dataLabel;
  @Input('data-validation') dataValid;
  @Output() dataOut = new EventEmitter();
  fileSelected = false;
  selFile = {file: null, buffer: null};
  constructor() { }

  ngOnInit() {
    // console.log(this.dataSet);
  }

  setAccept(type: string) {
    if (type === 'img') {
      return 'image/jpeg,image/png';
    }
    return null;
  }

  onFileSelect(event) {
    this.selFile.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.selFile.buffer = reader.result;
      this.dataOut.emit(this.selFile);
    };
    reader.readAsDataURL(this.selFile.file);
  }

  clickFile(event) {
    console.log(event);
  }

}
