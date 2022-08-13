import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {HomeService} from '../../service/home.service';
import {SingerService} from '../../service/singer.service';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {forkJoin, Observable} from 'rxjs';
import {first} from 'rxjs/operators';

type HomeDataType = [Banner[], HotTag[], Singer[], SongSheet[]]

@Injectable()
export class HomeResolveService implements Resolve<HomeDataType> {
  constructor(
    private homeService: HomeService,
    private singerService: SingerService
  ) {
  }

  resolve(): Observable<any> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger()
    ]).pipe(first());
  }
}
