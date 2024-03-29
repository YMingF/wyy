import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  RecordVal,
  User,
  UserSheet,
} from '../../../service/data-types/member.type';
import { SheetService } from '../../../service/sheet.service';
import { BatchActionsService } from '../../../store/batch-actions.service';
import { MemberService, RecordType } from '../../../service/member.service';
import { SongService } from '../../../service/song.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Singer, Song } from '../../../service/data-types/common.types';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from '../../../store';
import {
  getCurrentSong,
  getPlayer,
} from '../../../store/selectors/player.selector';
import { takeUntil } from 'rxjs/internal/operators';
import { findSongIndex } from '../../../utils/array';
import { Subject } from 'rxjs';
import { SetShareInfo } from '../../../store/actions/member.action';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
})
export class CenterComponent implements OnInit, OnDestroy {
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
  recordType = RecordType.weekData;
  currentIndex = -1;
  currentSong: Song;
  private destroy$ = new Subject();
  constructor(
    private batchActionServe: BatchActionsService,
    private sheetService: SheetService,
    private memberServe: MemberService,
    private songServe: SongService,
    private nzMessageServe: NzMessageService,
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>
  ) {
    this.route.data
      .pipe(map((res) => res.user))
      .subscribe(([user, userRecord, userSheet]) => {
        this.user = user;
        this.records = userRecord.slice(0, 10);
        this.userSheet = userSheet;
        this.listenCurrentSong();
      });
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listenCurrentSong() {
    this.store$
      .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe((song) => {
        this.currentSong = song;
        if (song) {
          const songs = this.records.map((item) => item.song);
          this.currentIndex = findSongIndex(songs, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }
  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe((list) => {
      this.batchActionServe.selectPlayList({ list, index: 0 });
    });
  }
  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe
        .getUserRecord(this.user.profile.userId.toString(), type)
        .subscribe((records) => {
          this.records = records.slice(0, 10);
        });
    }
  }
  onAddSong([song, play]) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      // 获取歌曲的url，因为原数据song里没有url
      this.songServe.getSongList(song).subscribe((list) => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], play);
        } else {
          this.nzMessageServe.create('warning', '无Url');
        }
      });
    }
  }

  // 收藏歌曲
  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id);
  }

  // 分享
  onShareSong(resource: Song, type = 'song') {
    const txt = this.makeTxt('歌曲', resource.name, resource.ar);
    this.store$.dispatch(
      SetShareInfo({ info: { id: resource.id.toString(), type, txt } })
    );
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    const makeByStr = makeBy.map((item) => item.name).join('/');
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
