import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Lyric, Song } from '../../service/data-types/common.types';
import { forkJoin, Observable } from 'rxjs';
import { SongService } from "../../service/song.service";
import { first } from "rxjs/operators";

type SongDataModel = [Song, Lyric]

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel> {
  constructor(private songServe: SongService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.songServe.getSongDetail(id),
      this.songServe.getLyric(Number(id))
    ]).pipe(first());
  }

}
