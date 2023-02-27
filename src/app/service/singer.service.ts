import { Inject, Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Singer, SingerDetail } from './data-types/common.types';

type SingerParams = {
  offset: number,
  limit: number,
  cat?: string
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001'
};

@Injectable({
  providedIn: ServiceModule
})
export class SingerService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) {
  }

  // 拿取歌手数据
  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({fromString: String(args)});
    return this.http.get<{ artists: Singer[] }>(this.url + 'artist/list', {params})
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }

  getSingerDetail(id: string): Observable<SingerDetail> {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.url}artists`, {params}).pipe(map(res => res as SingerDetail));
  }

  getSimiSinger(id: string): Observable<Singer[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(`${this.url}simi/artist`, {params}).pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
