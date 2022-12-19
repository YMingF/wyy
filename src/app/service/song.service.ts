import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Lyric, Song, SongUrl} from './data-types/common.types';


@Injectable({
  providedIn: ServiceModule
})
export class SongService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) {
  }

  // 获取歌曲数据
  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get(this.url + 'song/url', {params})
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  // 获取单首或多首歌的播放地址
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');
    return this.getSongUrl(ids).pipe(map(urls => this.generateSongList(songArr, urls)));
  }

  // 将当前歌单获取的歌曲信息tracks ，和单个歌曲获取的详情信息拼成之前在common.type.ts里定义的Song类型的样子
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(url => url.id === song.id).url;
      if (url) {
        result.push({...song, url});
      }
    });
    return result;
  }

  getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.url}lyric`, {params}).pipe(map(res => res as Lyric));
  }
}
