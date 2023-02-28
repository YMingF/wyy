export type Banner = {
   targetId: number;
   url: string;
   imageUrl: string
}

export type HotTag = {
   id: number;
   name: string;
   position: number
}

// 歌手
export type Singer = {
  id: number;
  name: string;
  picUrl: string,
  albumSize: number,
  alias: string[]
}
// 歌曲
export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[]; // 一首歌曲可能有多个歌手
  dt: number;// 播放总时长
  al: { id: number, name: string, picUrl: string } // 歌曲所属专辑的信息
}

//歌单数据类型
export type SongSheet = {
  id: number;
  name: string;
  picUrl: string;
  coverImgUrl: string;
  playCount: number;
  tracks: Song[]; // 歌单下的所有歌曲
  tags: string[],
  createTime: number,
  creator: { nickname: string, avatarUrl: string },
  description: string,
  subscribeCount: number,
  shareCount: number,
  commentCount: number,
  subscribed: boolean, // 是否订阅歌单
  userId: number,
  subscribedCount: number
}

// 歌曲地址
export type SongUrl = {
  id: number;
  url: string;
}
// 歌词
export type Lyric = {
  lyric: string,
  tlyric: string
}

export type SheetList = {
  total: number,
  playlists: SongSheet[]
}

export type SingerDetail={
  artist:Singer,
  hotSongs:Song[]
}
