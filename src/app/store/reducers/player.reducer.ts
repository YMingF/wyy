import {PlayMode} from '../../share/wy-ui/wy-player/player-type';
import {Song} from '../../service/data-types/common.types';
import {Action, createReducer, on} from '@ngrx/store';
import {
  SetCurrentIndex,
  SetPlaying,
  SetPlayList,
  SetPlayMode,
  SetSongList
} from '../actions/player.action';

export type PlayState = {
  // 播放状态，播放还是暂停
  playing: boolean;
  // 播放模式,随机，循环，还是单曲循环
  playMode: PlayMode
  // 歌曲列表
  songList: Song[];
  // 播放列表
  playList: Song[];
  // 当前正在播放的索引
  currentIndex: number
}

export const initialState: PlayState = {
  playing: false,
  playMode: {type: 'loop', label: '循环'},
  songList: [],
  playList: [],
  currentIndex: -1
};

const reducer = createReducer(
  initialState,
  on(SetPlaying, (state, {playing}) => ({...state, playing})),
  on(SetPlayList, (state, {playList}) => ({...state, playList})),
  on(SetSongList, (state, {songList}) => ({...state, songList})),
  on(SetPlayMode, (state, {playMode}) => ({...state, playMode})),
  on(SetCurrentIndex, (state, {currentIndex}) => ({...state, currentIndex}))
);

export function playerReducer(state: PlayState, action: Action) {
  return reducer(state, action);
}

