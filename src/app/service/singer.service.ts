import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {map, Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Singer} from './data-types/common.types';

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
   constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

   // 拿取歌手数据
   getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
      const params = new HttpParams({fromString: String(args)});
      return this.http.get<{ artists: Singer[] }>(this.url + 'artist/list', {params})
         .pipe(map((res: { artists: Singer[] }) => res.artists));
   }
}
