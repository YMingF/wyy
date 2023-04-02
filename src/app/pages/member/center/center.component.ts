import { Component, OnInit } from '@angular/core';
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
import { Song } from '../../../service/data-types/common.types';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from '../../../store';
import {
  getCurrentSong,
  getPlayer,
} from '../../../store/selectors/player.selector';
import { takeUntil } from 'rxjs/internal/operators';
import { findSongIndex } from '../../../utils/array';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
})
export class CenterComponent implements OnInit {
  user: User;
  records: RecordVal[];
  userSheet: UserSheet;
  recordType = RecordType.weekData;
  currentIndex = -1;
  currentSong: Song;
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
  listenCurrentSong() {
    this.store$
      .pipe(select(getPlayer), select(getCurrentSong))
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
  onLikeSong(e) {}
  onShareSong(e) {}
}
