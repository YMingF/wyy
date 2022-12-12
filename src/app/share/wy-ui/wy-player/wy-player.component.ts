import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderVal = 35;
  bufferOffset = 20;
  constructor() {
  }

  ngOnInit() {
  }

}
