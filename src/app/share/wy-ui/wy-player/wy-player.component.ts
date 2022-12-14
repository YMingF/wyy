import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppStoreModule} from '../../../store';
import {select, Store} from '@ngrx/store';
import {
  getCurrentIndex, getCurrentSong,
  getPlayer,
  getPlayList, getPlayMode,
  getSongList
} from '../../../store/selectors/player.selector';
import {Song} from '../../../service/data-types/common.types';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderVal = 35;
  bufferOffset = 80;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;
  currentTime: number;

  @ViewChild('audioEl', {static: true}) audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>
  ) {
    const stateArr = [
      {type: getSongList, cb: list => this.watchList(list, 'songList')},
      {type: getPlayList, cb: list => this.watchList(list, 'playList')},
      {type: getCurrentIndex, cb: index => this.watchCurrentIndex(index)},
      {type: getPlayMode, cb: mode => this.watchPlayMode(mode)},
      {type: getCurrentSong, cb: song => this.watchCurrentSong(song)}
    ];
    stateArr.forEach(item => {
      // @ts-ignore
      this.store$.pipe(select(getPlayer), select(item.type)).subscribe(item.cb);
    });
  }

  watchList(list, type: string) {
    this[type] = list;
  }

  watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  watchPlayMode(mode) {
    console.log('mode', mode);
  }

  watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = this.currentSong.dt / 1000;// dt属性的值为歌曲总时长,单位为毫秒
    }
  }

  onCanplay() {
    this.play();
  }

  play() {
    this.audioEl.play();
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }


}
