import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppStoreModule } from '../../../store';
import { select, Store } from '@ngrx/store';
import {
  getCurrentAction,
  getCurrentIndex,
  getCurrentSong,
  getPlayer,
  getPlayList,
  getPlayMode,
  getSongList,
} from '../../../store/selectors/player.selector';
import { Song } from '../../../service/data-types/common.types';
import {
  SetCurrentAction,
  SetCurrentIndex,
  SetPlayList,
  SetPlayMode,
} from '../../../store/actions/player.action';
import { Subscription, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PlayMode } from './player-type';
import { shuffle } from '../../../utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { NzModalService } from 'ng-zorro-antd';
import { BatchActionsService } from '../../../store/batch-actions.service';
import { Router } from '@angular/router';
import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CurrentActions } from '../../../store/reducers/player.reducer';

const modeTypes: PlayMode[] = [
  { type: 'loop', label: '循环' },
  { type: 'random', label: '随机' },
  { type: 'singleLoop', label: '单曲循环' },
];

enum TipTitles {
  Add = '已添加到列表',
  Play = '已开始播放',
}
@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
  animations: [
    trigger('showHide', [
      state('show', style({ bottom: 0 })),
      state('hide', style({ bottom: -71 })),
      transition('show=>hide', [animate('0.3s')]),
      transition('hide=>show', [animate('0.1s')]),
    ]),
  ],
})
export class WyPlayerComponent implements OnInit {
  @ViewChild('audioEl', { static: true }) audio: ElementRef;
  @ViewChild(WyPlayerPanelComponent, { static: false })
  private playerPanel: WyPlayerPanelComponent;
  showPlayer = 'hide';
  isLocked = false;
  animating = false; // 是否正在动画中
  percent = 0;
  bufferPercent = 0;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;
  currentTime: number;
  volume = 60; // 音量
  //是否展示音量面板
  showVolumePanel = false;
  //是否展示列表面板
  showPanel = false;
  winClick: Subscription; //window的click事件
  // 播放状态
  playing = false;
  //是否可以播放
  songReady = false;
  // 当前模式
  currentMode: PlayMode;
  modeCount = 0;
  // 是否绑定document click事件
  bindFlag = false;
  private audioEl: HTMLAudioElement;
  controlTooltip = {
    title: '',
    show: false,
  };

  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private batchActionServe: BatchActionsService,
    private router: Router
  ) {
    const stateArr = [
      { type: getSongList, cb: (list) => this.watchList(list, 'songList') },
      { type: getPlayList, cb: (list) => this.watchList(list, 'playList') },
      { type: getCurrentIndex, cb: (index) => this.watchCurrentIndex(index) },
      { type: getPlayMode, cb: (mode) => this.watchPlayMode(mode) },
      { type: getCurrentSong, cb: (song) => this.watchCurrentSong(song) },
      {
        type: getCurrentAction,
        cb: (action) => this.watchCurrentAction(action),
      },
    ];
    stateArr.forEach((item) => {
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
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(list);
      }
      this.store$.dispatch(SetPlayList({ playList: list }));
      this.updateCurrentIndex(list, this.currentSong);
    }
  }

  watchCurrentSong(song: Song) {
    this.currentSong = song;
    if (song) {
      this.duration = this.currentSong.dt / 1000; // dt属性的值为歌曲总时长,单位为毫秒
    }
  }

  watchCurrentAction(action: CurrentActions) {
    const title = TipTitles[CurrentActions[action]];
    if (title) {
      this.controlTooltip.title = title;
      if (this.showPlayer === 'hide') {
        this.togglePlayer('show');
      } else {
        this.showToolTip();
      }
    }
    this.store$.dispatch(
      SetCurrentAction({ currentAction: CurrentActions.Other })
    );
  }

  showToolTip() {
    this.controlTooltip.show = true;
    timer(1500).subscribe(() => {
      this.controlTooltip = {
        title: '',
        show: false,
      };
    });
  }

  onAnimateDone(evt: AnimationEvent) {
    this.animating = false;
    if (evt.toState === 'show' && this.controlTooltip.title) {
      this.showToolTip();
    }
  }

  // 随机模式下，歌曲顺序改变，但当前播放的歌不变
  updateCurrentIndex(list: Song[], currentSong: Song) {
    const newIndex = list.findIndex((song) => song.id === currentSong.id);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
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

  //播放错误,重置歌曲播放状态
  onError() {
    this.playing = false;
    this.bufferPercent = 0;
  }

  // 播放/暂停
  onToggle() {
    if (!this.currentSong) {
      // 这里用来表示只添加歌单，但不播放的场景
      if (this.playList.length) {
        // 若没点击播放，但此时播放列表不为空的话，就默认播放第一首
        this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
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
      this.currentIndex =
        this.currentIndex === 0
          ? this.playList.length - 1
          : this.currentIndex - 1;
      this.updateIndex(this.currentIndex);
    }
  }

  // 播放下一首
  onNext() {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      this.currentIndex =
        this.currentIndex === this.playList.length - 1
          ? 0
          : this.currentIndex + 1;
      this.updateIndex(this.currentIndex);
    }
  }

  // 单曲循环
  loop() {
    this.audioEl.currentTime = 0;
    this.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0); // 传时间戳
    }
  }

  play() {
    this.audioEl.play();
    this.playing = true;
  }

  updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
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
    return this.currentSong
      ? this.currentSong.al.picUrl
      : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  onClickOutside(target: HTMLElement) {
    // 来解决点击歌曲面板中每个歌曲的删除按钮时，面板消失的问题
    if (target.dataset.act !== 'delete') {
      this.showVolumePanel = false;
      this.showPanel = false;
      this.bindFlag = false;
    }
  }

  onPercentChange(per) {
    if (this.currentSong) {
      const currentTime = this.duration * (per / 100);
      this.audioEl.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000); // 传时间戳
      }
    }
  }

  onVolumeChange(per: number) {
    // audio标签的音量范围是0-1，而per的值是0-100
    this.audioEl.volume = per / 100;
  }

  // 控制音量面板是否展示
  toggleVolPanel() {
    this.togglePanel('showVolumePanel');
  }

  // 控制列表面板展示
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showPanel');
    }
  }

  togglePanel(type: string) {
    this[type] = !this[type];
    this.bindFlag = this.showVolumePanel || this.showPanel;
  }

  // 改变模式
  changeMode() {
    this.store$.dispatch(
      SetPlayMode({ playMode: modeTypes[++this.modeCount % 3] })
    );
  }

  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  onDeleteSong(song: Song) {
    this.batchActionServe.deleteSong(song);
  }

  onClearSong() {
    this.nzModalServe.confirm({
      nzTitle: '确认清空列表?',
      nzOnOk: () => {
        this.batchActionServe.clearSong();
      },
    });
  }

  toInfo(path: [string, number]) {
    if (path[1]) {
      this.showPanel = false;
      this.showVolumePanel = false;
      this.router.navigate(path);
    }
  }

  togglePlayer(type: string) {
    if (!this.isLocked && !this.animating) {
      this.showPlayer = type;
    }
  }
}
