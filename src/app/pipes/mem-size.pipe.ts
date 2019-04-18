import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memSize'
})
export class MemSizePipe implements PipeTransform {
  actData: string;
  reqData: string;
  transform(value: number, arg1?: string, arg2?: string): string {
    this.actData = arg1 || 'bytes';
    this.reqData = arg2 || 'KB';
    console.log(arg1, arg2);
    if (!arg1 && !arg2) {
      const val = Number(value / 1024).toFixed(2);
      const fVal = this.checkForZeros(val);
      return fVal + ' ' + this.reqData;
    }
    return null;
  }

  checkForZeros(number): any {
    const tval = number.toString().split('.');
    if (tval[1] === '00') {
      return tval[0];
    } else {
      return number;
    }
  }
}
