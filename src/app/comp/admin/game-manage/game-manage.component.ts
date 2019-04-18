import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../../models/game.model';
import { Sponsor } from '../../../models/sponsor.model';
import { FireService } from '../../../services/fire.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-game-manage',
  templateUrl: './game-manage.component.html',
  styleUrls: ['./game-manage.component.css']
})
export class GameManageComponent implements OnInit {
  @Input('gameObj') public curGame: Game;
  @Output() dataOut = new EventEmitter();
  sponsors: Sponsor[] = [];
  constructor(
    private _fs: FireService,
    private _ds: DataService
  ) { }

  ngOnInit() {
    console.log(this.curGame);
  }

}
