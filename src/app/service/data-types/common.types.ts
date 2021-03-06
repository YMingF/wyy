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

//歌单数据类型
export type SongSheet = {
   id: number;
   name: string;
   picUrl: string,
   playCount: number
}

// 歌手
export type Singer = {
   id: number;
   name: string;
   picUrl: string,
   albumSize: number
}