import {Injectable} from '@angular/core';
import { Resolve } from '@angular/router';
import {HomeService} from '../../service/home.service';
import {SingerService} from '../../service/singer.service';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {first, forkJoin, Observable, take} from 'rxjs';

// 定义返回类型
type HomeDataType= [Banner[],HotTag[],SongSheet[],Singer[]];

@Injectable({ providedIn: 'root' })
export class HomeResolveService implements Resolve<HomeDataType> {
   constructor(
      private homeService: HomeService,
      private singerService: SingerService
   ) {}

   resolve():Observable<HomeDataType> {
      return forkJoin([
         this.homeService.getBanners(),
         this.homeService.getHotTags(),
         this.homeService.getPersonalSheetList(),
         this.singerService.getEnterSinger()
      ]).pipe(first());
   }
}