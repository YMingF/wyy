import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from "rxjs/operators";
import { SingerDetail } from "../../../service/data-types/common.types";
import { SingerService } from "../../../service/singer.service";


@Injectable()
export class SingerDetailResolverService implements Resolve<SingerDetail> {
  constructor(private singerServe: SingerService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
    const id = route.paramMap.get('id');
    return this.singerServe.getSingerDetail(id).pipe(first());
  }

}
