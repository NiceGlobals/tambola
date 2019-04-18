import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

  constructor() {}

  extractData(data: any) {
    // let keys = Object.keys(data);
    // console.log(data);
    const len = Object.keys(data).length;
    // console.log(len);
    const dataList = [];
    for (let i = 0; i < len; i++) {
      const Data = data[Object.keys(data)[i]];
      dataList.push(Data);
    }
    // console.log(keys);
    return dataList;
  }

  extractDataWithKeys(data: any) {
    // let keys = Object.keys(data);
    const len = Object.keys(data).length;
    // console.log(len);
    const dataList = [];
    for (let i = 0; i < len; i++) {
      let Data = data[Object.keys(data)[i]];
      Data.gid = Object.keys(data)[i];
      dataList.push(Data);
    }
    // console.log(keys);
    return dataList;
  }

  getKeys(data: any) {
    console.log(Object.keys(data));
  }

  getConvertedDate(date: any) {
    const dt = new Date(date).toLocaleString('en-US', { timeZone: 'America/Atikokan' }) + ' CST';
    return dt;
  }

  getDTF(dt: any, type: number) {
    const DT = new Date(dt);
    let dtf;
    // for only date format
    if (type === 0) {
      const dtObj = {date: DT.getDate(), year: DT.getFullYear(), month: DT.getMonth()}
      dtf = dtObj.year + '-' + this.getTwoDigit(dtObj.month + 1) + '-' + this.getTwoDigit(dtObj.date);
    }
    //  For date and time format
    if (type === 1)  {

    }
    return dtf;
  }

  getTwoDigit(num: number) {
    if (num < 10) {
      const Num = '0' + num;
      return Num;
    } else {
      return num;
    }
  }

  getItemsPerPage() {
    return [10, 15, 25, 50, 100, 250, 500];
  }
}
