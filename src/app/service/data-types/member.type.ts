import { Song, SongSheet } from './common.types';

export interface User {
  // 等级
  level?: number;

  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
}

export type SignIn = {
  code: number;
  point?: number;
  mgs?: number;
};

export type RecordVal = {
  playCount: number;
  score: number;
  song: Song;
};
type recordKeys = 'weekData' | 'allData';
export type UserRecord = {
  [key in recordKeys]: RecordVal[];
};

export type UserSheet = {
  self: SongSheet[]; //自己创建的歌单
  subscribed: SongSheet[];
};
