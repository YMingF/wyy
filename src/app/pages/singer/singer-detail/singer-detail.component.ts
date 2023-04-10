import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Singer,
  SingerDetail,
  Song,
} from '../../../service/data-types/common.types';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from '../../../store';
import { SongService } from '../../../service/song.service';
import { BatchActionsService } from '../../../store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import {
  getCurrentSong,
  getPlayer,
} from '../../../store/selectors/player.selector';
import { takeUntil } from 'rxjs/internal/operators';
import { findSongIndex } from '../../../utils/array';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetShareInfo } from '../../../store/actions/member.action';
import { MemberService } from '../../../service/member.service';
import { NzToolClass } from '../../../utils/tools';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less'],
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  singerDetail: SingerDetail;
  currentIndex = -1;
  currentSong: Song;
  simiSingers: Singer[];
  hasLiked = false;
  private destroy$ = new Subject<void>();
  nzToolClass: NzToolClass;
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private memberServe: MemberService,
    private messageServe: NzMessageService
  ) {
    this.route.data
      .pipe(map((res) => res.singerDetail))
      .subscribe(([singerDetail, simiSingers]) => {
        this.singerDetail = singerDetail;
        this.simiSingers = simiSingers;
        this.listenCurrent();
      });
    this.nzToolClass = new NzToolClass(this.messageServe);
  }

  private listenCurrent() {
    // takeUntil(this.destroy$) 表示当this.destroy$发射流的时候停止监听
    this.store$
      .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe((song) => {
        this.currentSong = song;
        if (song) {
          this.currentIndex = findSongIndex(this.singerDetail.hotSongs, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  onAddSong(song: Song, isPlay = false) {
    // 当前没正播放歌曲，或播放歌曲和想添加的歌曲不同时，才允许添加歌曲
    if (!this.currentSong || this.currentSong.id !== song.id) {
      // 获取歌曲的url，因为原数据song里没有url
      this.songServe.getSongList(song).subscribe((list) => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          this.nzMessageServe.create('warning', '无Url');
        }
      });
    }
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe((list) => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({ list, index: 0 });
        } else {
          this.batchActionServe.insertSongs(list);
        }
      }
    });
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

  // 批量收藏
  onLikeSongs(songs: Song[]) {
    const ids = songs.map((item) => item.id).join(',');
    this.onLikeSong(ids);
  }

  //收藏歌手
  onLikeSinger(id: number) {
    let typeInfo = {
      type: 1,
      msg: '收藏',
    };
    if (this.hasLiked) {
      typeInfo = {
        type: 2,
        msg: '取消收藏',
      };
    }
    this.memberServe.likeSinger(id.toString(), typeInfo.type).subscribe(
      () => {
        this.hasLiked = !this.hasLiked;
        this.nzToolClass.alertMessage('success', typeInfo.msg + '成功');
      },
      (error) => {
        this.nzToolClass.alertMessage(
          'error',
          error.msg || typeInfo.msg + '失败'
        );
      }
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
