import { Component, OnInit, OnChanges } from '@angular/core';
import { Ticket } from '../../../models/ticket.model';
import { DataService } from '../../../services/data.service';
import { FireService } from '../../../services/fire.service';
import { Observable } from 'rxjs/Observable';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Game } from '../../../models/game.model';

@Component({
  selector: 'app-ticket-setup',
  templateUrl: './ticket-setup.component.html',
  styleUrls: ['./ticket-setup.component.css']
})
export class TicketSetupComponent implements OnInit, OnChanges {
searchedTicket: any;
// tickets: Ticket[];
tickets: Observable<Ticket[]>;
ticketsSnap: Ticket[] = [];
ticketsSnapCopy: Ticket[] = [];
ticketId: string;
gameFilter = 'all';
gameFilterMode = false;
games: Observable<Game[]>;
gamesList: Game[] = [];
smi = 0;
smr = 25;
smx = this.smr;
countStep = [10, 15, 25];
noTicket = true;
noTicketFound = false;
  constructor(
    private _ds: DataService,
    private _fs: FireService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this._fs.getTickets().subscribe(
    (snap: any) => {
      // console.log('tickets snap:', snap);
      // this.tickets = snap.reverse();
      this.tickets = snap;
      // console.log(snap[0]);
      this.ticketsSnap = snap.reverse();
      this.ticketsSnapCopy = snap.reverse();
      if (this.gameFilterMode) {
        this.filterByGame();
      }
    });
    this._fs.getGames().subscribe(
      (games: any) => {
        this.games = games;
        this.gamesList = games.sort((a, b) => (a.gt > b.gt ? -1 : 1));
        // console.log(this.gamesList);
      }
    );
    if (this.tickets) {
      // console.log(this.tickets);
    }

    this.countStep = this._ds.getItemsPerPage();

  }

  ngOnChanges() {
    console.log('Onchange calling');
    this._fs.getTickets().subscribe(
      (snap: any) => {
        // console.log('tickets snap:', snap);
      this.tickets = snap;
      this.ticketsSnap = snap.reverse();
      this.ticketsSnapCopy = snap.reverse();
      if (this.gameFilterMode) {
        this.filterByGame();
      }
    });
  }

  searchTicket(tid?: string) {
    if (tid) {
      this.ticketId = tid.toUpperCase();
    } else {
      this.ticketId = this.ticketId.toUpperCase();
    }
    this.resState();
    this._fs.checkTicket(this.ticketId).then(
      snap => {
        // console.log(snap);
        if (snap != null) {
          const tick = this._ds.extractData(snap);
          this.searchedTicket = tick[0];
          // console.log(this.searchedTicket);
          this.noTicketFound = false;
          this.noTicket = false;
        } else {
          this.noTicketFound = true;
        }
      }
    ).catch(
      err => {
        console.log(err.message);
        alert('Some error occured, please try again later');
      }
    );
  }

  resState() {
    this.noTicket = true;
    this.noTicketFound = false;
    this.searchedTicket = null;
  }

  resState2() {
    this.ticketId = null;
    this.resState();
    window.scrollTo(0, 0);
  }

  getDateConverted(date: any) {
    return this._ds.getConvertedDate(date);
  }

  exportData() {
    const options = {
      showLabels: true,
      showTitle: false,
      headers: ['Ticket No', 'Participant Name', 'Email address', 'Phone No']
    };
    const Data = [];
    for (let x = 0; x < this.ticketsSnap.length; x++) {
      const dataObj = {
        Ticket_No: this.ticketsSnap[x].tid,
        Participant_Name: this.ticketsSnap[x].userName,
        Email: this.ticketsSnap[x].email,
        Phone: this.ticketsSnap[x].phone
      };

      Data.push(dataObj);
    }
    const dataz = new Angular2Csv(Data, 'Ticket_registration_data', options);
  }

  ticketsPerPage(n: number, tot: number) {
    if (n === 0) {
      this.smi = 0;
      this.smx = this.smr;
    }
    if (n === 1) {
      this.smi = this.smi - this.smr;
      this.smx = this.smx - this.smr;
    }
    if (n === 2) {
      this.smi = this.smi + this.smr;
      this.smx = this.smx + this.smr;
    }
    if (n === 3) {
      const coff = tot % this.smr;
      const div = tot / this.smr;
      if (coff > 0) {
        this.smx = (Math.floor(div) + 1) * this.smr;
        this.smi = Math.floor(div) * this.smr;
        // let smx = (Math.floor(div) + 1) * this.smr;
        // let smi = Math.floor(div) * this.smr;
        // console.log('SMI: ', + smi, 'SMR: ' + smx);
      } else {
        this.smx = div * this.smr;
        this.smi = (div - 1) * this.smr;
      }
      // console.log(coff, div);
      // this.smi = this.smi + this.smr;
      // this.smx = this.smx + this.smr;
    }
  }

  adjustRange() {
    this.smi = 0;
    this.smx = this.smr;
  }

  filterByGame() {
    this.ticketsSnap = this.ticketsSnapCopy;
    if (this.gameFilter !== 'all') {
      this.gameFilterMode = true;
      let filteredArray = [];
      // console.log(this.gameFilter);
      for (let x = 0; x < this.ticketsSnapCopy.length; x++) {
        if (this.ticketsSnapCopy[x].gameid === this.gameFilter) {
          filteredArray.push(this.ticketsSnap[x]);
        }
      }
      this.ticketsSnap = filteredArray;
    }
  }
}
