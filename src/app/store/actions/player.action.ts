import {createAction, props} from '@ngrx/store';
import {Song} from '../../service/data-types/common.types';
import {PlayMode} from '../../share/wy-ui/wy-player/player-type';
// createAction的参数1用来描述这个动作在干啥
export const SetPlaying = createAction('[player] Set playing', props<{ playing: boolean }>());
export const SetPlayList = createAction('[player] Set playList', props<{ playList: Song[] }>());
export const SetSongList = createAction('[player] Set songList', props<{ songList: Song[] }>());
export const SetPlayMode = createAction('[player] Set PlayMode', props<{ playMode: PlayMode }>());
export const SetCurrentIndex = createAction('[player] Set CurrentIndex', props<{ currentIndex: number }>());
