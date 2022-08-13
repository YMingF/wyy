import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Banner, HotTag, SongSheet} from './data-types/common.types';

@Injectable({
  providedIn: ServiceModule
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) {
  }

  getBanners(): Observable<Banner[]> {
    return this.http.get<{ banners: Banner[] }>(this.url + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  getHotTags(): Observable<HotTag[]> {
    return this.http.get<{ tags: HotTag[] }>(this.url + 'playlist/hot')
      .pipe(map((res: { tags: HotTag[] }) => {
        return res.tags.sort((x: HotTag, y: HotTag) => {
          return x.position - y.position;
        }).slice(0, 5);
         }));
   }

   getPersonalSheetList(): Observable<SongSheet[]> {
      return this.http.get<{ result: SongSheet[] }>(this.url + 'personalized')
         .pipe(map((res: { result: SongSheet[] }) => res.result));
   }
}
