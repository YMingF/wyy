import {API_CONFIG, ServiceModule} from './service.module';
import {Injectable, Inject} from '@angular/core';
import {Song, SongSheet} from './data-types/common.types';
import {Observable} from 'rxjs';
import {HttpParams, HttpClient} from '@angular/common/http';
import {map, pluck, switchMap} from 'rxjs/internal/operators';
import {SongService} from './song.service';

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
