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
import {SetCurrentIndex} from '../../../store/actions/player.action';

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
  // 播放状态
  playing = false;
  //是否可以播放
  songReady = false;
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
    console.log('list');
    console.log(list);
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
      console.log('此时的歌');
      console.log(song);
    }
  }

  onCanplay() {
    this.play();
    this.songReady = true;
  }

  // 播放/暂停
  onToggle() {
    if (!this.currentSong) { // 这里用来表示只添加歌单，但不播放的场景
      if (this.playList.length) { // 若没点击播放，但此时播放列表不为空的话，就默认播放第一首
        this.store$.dispatch(SetCurrentIndex({currentIndex: 0}));
        this.songReady = false;
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        this.playing ? this.audioEl.play() : this.audioEl.pause();
      }
    }
  }

  onPrev() {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      this.currentIndex = this.currentIndex === 0 ? this.playList.length - 1 : this.currentIndex - 1;
      this.updateIndex(this.currentIndex);
    }
  }

  onNext() {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      this.currentIndex = this.currentIndex === this.playList.length - 1 ? 0 : this.currentIndex + 1;
      this.updateIndex(this.currentIndex);
    }
  }

  loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }

  play() {
    this.audioEl.play();
    this.playing = true;
  }

  updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({currentIndex: index}));
    this.songReady = false;
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
