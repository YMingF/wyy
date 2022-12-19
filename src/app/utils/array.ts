import {Song} from '../service/data-types/common.types';

export function inArray(arr: any[], target: any): boolean {
  return arr.includes(target);
}

// 数组乱序
export function shuffle(arr) {
  const newArr = arr.map(item => (
    {val: item, rm: Math.random()}
  ));
  newArr.sort((a, b) => a.rm - b.rm);
  newArr.splice(0, arr.length, ...(newArr.map(arr => arr.val)));
  return newArr;
}

export function findSongIndex(songList: Song[], currentSong: Song) {
  return songList.findIndex(song => song.id === currentSong.id);
}
