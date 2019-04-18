import { Component, OnInit } from '@angular/core';
import { Game } from '../../../models/game.model';
import { Ticket } from '../../../models/ticket.model';
import { User } from '../../../models/user.model';
import { FireService } from '../../../services/fire.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  mode = 0;
  games: Game[];
  tickets: Ticket[];
  users: User[];
  stats: any;
  constructor(private _fs: FireService) {}

  ngOnInit() {
    this._fs.getStat().on('value', (snap) => {
      this.stats = snap.val();
    });
  }

}
