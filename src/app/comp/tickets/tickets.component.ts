import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game.model';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Ticket } from '../../models/ticket.model';
import { CurUser } from '../../models/cuser.model';
import { FireService } from '../../services/fire.service';
import { DataService } from '../../services/data.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import * as firebase from 'firebase';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
trustedUrl: SafeResourceUrl;
ticket: any;
game: Game;
waitingforUser = true;
selectedGameId: string;
selectedGame: Game;
selectedTicketId: string;
selectedTicket: Ticket;
user: User;
fState = 0;
userTickets;
errOccured = false;
errMessage = null;
ticketSelected = false;
  constructor(private _gs: GameService,
    private _route: ActivatedRoute,
    private _us: UserService,
    private _fs: FireService,
    private _ds: DataService,
    private sanitizer: DomSanitizer,
    private _router: Router) { }

  @ViewChild('ticketContent') ticketContent: ElementRef;

  ngOnInit() {
    this.user = this._us.getUserData();
    if (this.user) {
      this.waitingforUser = false;
      this.setUserTickets();
      this.trackParam();
    }
    this._us.curUserUpdated.subscribe(
      (user: any) => {
        this.user = user;
        this.setUserTickets();
        this.trackParam();
        this.waitingforUser = false;
      }
    );
    console.log(`waiting for user: ${this.waitingforUser}`);
  }

  setUserTickets() {
    if (this.user.tickets && this.user.tickets.length > 0) {
      this.userTickets = this.user.tickets;
      // console.log(this.userTickets);
    }
  }

  trackParam() {
    if (this._route.snapshot.params['gid']) {
      this.fState = 1;
      const gameId = this._route.snapshot.params['gid'];
      this.setGameId(gameId);
    } else {
      // console.log('no_game_selected');
      this.fState = 0;
    }
  }

  vewTicket(gameId: string) {
    this._router.navigateByUrl('/tickets/' + gameId);
  }

  setGameId(gameId: string) {
    this.selectedGameId = gameId;
    const gm = this._gs.getGame(this.selectedGameId);
    this.selectedGame = Object.assign({}, gm);
    // console.log(this.selectedGameId);
    if (this.waitingforUser) {
      setTimeout(() => {
        this.setGameId(gameId);
      }, 750);
    } else {
      if (this.user && this.user.tickets && this.selectedGame) {
        this.trustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedGame.tc);
        this.pichTicket(this.selectedGameId);
      } else {
        this.selectedTicket = null;
        // console.log('no_user_found');
      }
    }
  }

  pichTicket(gid) {
    const tickets = this.user.tickets;
    for (let x = 0; x < tickets.length; x++) {
      if (tickets[x].indexOf(gid) !== -1) {
        this.selectedTicketId = tickets[x][0];
        this.fetchTicket();
      }
    }
    // console.log(this.selectedTicketId);
  }

  fetchTicket() {
    console.log('tid: ', this.selectedTicketId);
    this._fs.checkTicket(this.selectedTicketId).then(
      snap => {
        const Tkey = Object.keys(snap)[0];
        console.log('Ticket fetch status:', Tkey);
        this.selectedTicket = this._ds.extractData(snap)[0];
        this.ticketSelected = true;
        // console.log(this.selectedTicket.tkey);
      }
    ).catch(
      err => {
        this.errOccured = true;
        this.errMessage = 'Ooops! something went wrong, Please try again later or contact Admin.';
        const logData = {
          lit: new Date().getTime(),
          lType: 'warn',
          data: {
            Type: 'ticket_query',
            message: `invalid data provided | ${this.selectedTicketId} | ${err.message}`, email: firebase.auth().currentUser.email}
        };
        this._fs.postLog(logData);
        alert(this.errMessage);
        this.resetAllState();
      }
    );
  }

  resetAllState() {
    this.selectedGame = null;
    this.selectedTicket = null;
    this.selectedGameId = null;
    this.selectedTicketId = null;
    this.ticketSelected = false;
    this._router.navigateByUrl('/tickets');
  }

  printTicket() {
    window.print();
  }

  downloadTicket() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };

    const content = this.ticketContent.nativeElement;
    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('MASTITIME_TAMBOLA_' + this.selectedTicketId);
  }

  getConvertedDate(date: any) {
    const dt = new Date(date).toLocaleString('en-US', { timeZone: 'America/Atikokan' }) + ' CST';
    return dt;
  }
}
