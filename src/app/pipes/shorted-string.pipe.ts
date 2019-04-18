import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortedString'
})
export class ShortedStringPipe implements PipeTransform {

  transform(value: any, args?: number): string {
    // console.log('pipe values: ', value);
    // console.log('pipe args: ', args);
    let returnStr = '';
    if (args && value.length > args) {
      const str1 = value.slice(0, ((args / 2) - 1));
      const str2 = value.slice(((value.length - ((args / 2) - 1))), value.length);
      returnStr = str1 + '...' + str2;
      return returnStr;
    }
    if (args && value.length <= args) {
      return value;
    }
    if (!args && value.length > 20) {
      const str1 = value.slice(0, 9);
      const str2 = value.slice((value.length - 9), value.length);
      returnStr = str1 + '...' + str2;
      return returnStr;
    }
    if (!args && value.length <= 20) {
      return value;
    }
    return null;
  }

}
