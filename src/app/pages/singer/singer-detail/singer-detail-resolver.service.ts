import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Singer, SingerDetail } from '../../../service/data-types/common.types';
import { SingerService } from '../../../service/singer.service';

type SingerDetailDataModel = [SingerDetail, Singer[]];
@Injectable()
export class SingerDetailResolverService
  implements Resolve<SingerDetailDataModel>
{
  constructor(private singerServe: SingerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.singerServe.getSingerDetail(id).pipe(first()),
      this.singerServe.getSimiSinger(id),
    ]).pipe(first());
  }
}
