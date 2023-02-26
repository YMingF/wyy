import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { Song } from "../../service/data-types/common.types";
import { WyLyric } from "../../share/wy-ui/wy-player/wy-player-panel/wy-lyric";

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit {
  song: Song;
  lyric;

  constructor(private route: ActivatedRoute) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.lyric = new WyLyric(lyric).lines;
    })

  }

  ngOnInit() {
  }

}
