import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AppStoreModule} from '../../../store';
import {select, Store} from '@ngrx/store';
import {
  getCurrentIndex, getCurrentSong,
  getPlayer,
  getPlayList, getPlayMode,
  getSongList
} from '../../../store/selectors/player.selector';
import {Song} from '../../../service/data-types/common.types';
import {SetCurrentIndex, SetPlayList, SetPlayMode} from '../../../store/actions/player.action';
import {fromEvent, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {PlayMode} from './player-type';
import {shuffle} from '../../../utils/array';

const modeTypes: PlayMode[] = [
  {type: 'loop', label: '循环'},
  {type: 'random', label: '随机'},
  {type: 'singleLoop', label: '单曲循环'}
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  percent = 0;
  bufferPercent = 0;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;
  currentTime: number;
  volume = 60;// 音量
  //是否展示播放面板
  showVolumePanel = false;
  // 是否点击音量面板本身
  selfClick = false;

  winClick: Subscription;//window的click事件
  // 播放状态
  playing = false;
  //是否可以播放
  songReady = false;
  // 当前模式
  currentMode: PlayMode;
  modeCount = 0;
  @ViewChild('audioEl', {static: true}) audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
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
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(list);
        this.store$.dispatch(SetPlayList({playList: list}));
        this.updateCurrentIndex(list, this.currentSong);
      }
    }

  }

  watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = this.currentSong.dt / 1000;// dt属性的值为歌曲总时长,单位为毫秒
    }
  }

  // 随机模式下，歌曲顺序改变，但当前播放的歌不变
  updateCurrentIndex(list: Song[], currentSong: Song) {
    const newIndex = list.findIndex(song => song.id === currentSong.id);
    this.store$.dispatch(SetCurrentIndex({currentIndex: newIndex}));
  }

  onCanplay() {
    this.play();
    this.songReady = true;
  }

  onEnded() {
    this.playing = false;
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext();
    }
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

// 播放上一首
  onPrev() {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      this.currentIndex = this.currentIndex === 0 ? this.playList.length - 1 : this.currentIndex - 1;
      this.updateIndex(this.currentIndex);
    }
  }

  // 播放下一首
  onNext() {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      this.currentIndex = this.currentIndex === this.playList.length - 1 ? 0 : this.currentIndex + 1;
      this.updateIndex(this.currentIndex);
    }
  }

  // 单曲循环
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
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferPercent < 100) {
      // buffered.end(0)表示缓冲区域结束的位置，是一个时间
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  onPercentChange(per) {
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (per / 100);
    }
  }

  onVolumeChange(per: number) {
    // audio标签的音量范围是0-1，而per的值是0-100
    this.audioEl.volume = per / 100;
  }

  // 控制音量面板是否展示
  toggleVolPanel() {
    this.showVolumePanel = !this.showVolumePanel;
    if (this.showVolumePanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }

  bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) { // 说明点击了播放器以外区域
          this.showVolumePanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  unbindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  // 改变模式
  changeMode() {
    this.store$.dispatch(SetPlayMode({playMode: modeTypes[++this.modeCount % 3]}));
  }
}
