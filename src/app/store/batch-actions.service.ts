import { Injectable } from '@angular/core';
import { AppStoreModule } from './index';
import { Song } from '../service/data-types/common.types';
import { select, Store } from '@ngrx/store';
import { getPlayer } from './selectors/player.selector';
import { CurrentActions, PlayState } from './reducers/player.reducer';
import { SetCurrentAction, SetCurrentIndex, SetPlayList, SetSongList } from './actions/player.action';
import { findSongIndex, shuffle } from '../utils/array';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  private playerState: PlayState;

  constructor(private store$: Store<AppStoreModule>) {
    // 获取总的State的值
    this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
  }

  // 播放列表
  selectPlayList({list, index}: { list: Song[], index: number }) {
    this.store$.dispatch(SetSongList({songList: list}));
    let playList = list.slice();
    let trueIndex = index;
    // 用于处理先切换播放模式，后点击歌单播放时，保证随机切歌的正确
    if (this.playerState.playMode.type === 'random') {
      playList = shuffle(list);
      trueIndex = findSongIndex(playList, list[trueIndex]);
    }
    this.store$.dispatch(SetPlayList({playList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex: trueIndex}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Play}));
  }

  // 添加歌曲
  insertSong(song: Song, isPlay: boolean) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let insertIndex = this.playerState.currentIndex;
    const pIndex = findSongIndex(playList, song);
    if (pIndex > -1) {
      // 歌曲已存在
      if (isPlay) {
        insertIndex = pIndex;
      }
    } else {
      songList.push(song);
      playList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      this.store$.dispatch(SetSongList({songList}));
      this.store$.dispatch(SetPlayList({playList}));
    }
    if (insertIndex !== this.playerState.currentIndex) {
      this.store$.dispatch(SetCurrentIndex({currentIndex: insertIndex}));
      this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Play}));
    }else{
      this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Add}));
    }
  }

  deleteSong(song: Song) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    let currentIndex = this.playerState.currentIndex;
    const sIndex = findSongIndex(songList, song);
    songList.splice(sIndex, 1);
    const pIndex = findSongIndex(playList, song);
    playList.splice(pIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length - 1) {
      currentIndex--;
    }
    this.store$.dispatch(SetSongList({songList}));
    this.store$.dispatch(SetPlayList({playList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Delete}));

  }

  clearSong() {
    this.store$.dispatch(SetSongList({songList: []}));
    this.store$.dispatch(SetPlayList({playList: []}));
    this.store$.dispatch(SetCurrentIndex({currentIndex: -1}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Clear}));
  }

//  添加多首歌曲
  insertSongs(songs: Song[]) {
    const songList = this.playerState.songList.slice();
    const playList = this.playerState.playList.slice();
    songs.forEach(item => {
      const pIndex = findSongIndex(playList, item);
      if (pIndex === -1) {
        songList.push(item);
        playList.push(item);
      }
    });
    this.store$.dispatch(SetSongList({songList}));
    this.store$.dispatch(SetPlayList({playList}));
    this.store$.dispatch(SetCurrentAction({currentAction: CurrentActions.Add}));
  };
}
