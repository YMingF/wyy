import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServiceModule} from './service.module';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Banner} from './data-types/common.types';

@Injectable({
   providedIn: ServiceModule
})
export class HomeService {

   constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

   getBanners(): Observable<Banner[]> {
      return this.http.get<{ banners: Banner[] }>(this.url + 'banner')
         .pipe(map((res: { banners: Banner[] }) => res.banners));
   }
}
