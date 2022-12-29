import {API_CONFIG, ServiceModule} from './service.module';
import {Inject, Injectable} from '@angular/core';
import {SheetList, Song, SongSheet} from './data-types/common.types';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, pluck, switchMap} from 'rxjs/internal/operators';
import {SongService} from './song.service';
import * as queryString from 'querystring';

export type SheetParams = {
  offset: number,// 用来分页
  order: 'new' | 'hot',// 最新or最热？
  limit: number, // 歌单数量
  cat: string
}

@Injectable({
  providedIn: ServiceModule
})
export class SheetService {

  constructor(
    private http: HttpClient,
    private songService: SongService,
    @Inject(API_CONFIG) private uri: string
  ) {
  }

  // 获取歌单列表
  getSheets(args: SheetParams): Observable<SheetList> {
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.uri + 'top/playList', {params}).pipe(map(res => res as SheetList));
  }

  // 获取歌单详情
  getSongSheetDetail(id: number): Observable<SongSheet> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'playlist/detail', {params})
      .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  playSheet(id: number): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(pluck('tracks'), switchMap(tracks => this.songService.getSongList(tracks)));
  }

}
