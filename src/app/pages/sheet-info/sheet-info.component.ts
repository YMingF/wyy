import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { AppStoreModule } from '../../store';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { BatchActionsService } from '../../store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Singer, Song, SongSheet } from '../../service/data-types/common.types';
import { SongService } from '../../service/song.service';
import {
  getCurrentSong,
  getPlayer,
} from '../../store/selectors/player.selector';
import { findSongIndex } from '../../utils/array';
import { MemberService } from '../../service/member.service';
import { NzToolClass } from '../../utils/tools';
import { SetShareInfo } from '../../store/actions/member.action';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less'],
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  sheetInfo: SongSheet;

  description = {
    short: '',
    long: '',
  };

  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down',
  };

  currentSong: Song;
  currentIndex = -1;
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
    this.nzToolClass = new NzToolClass(messageServe);
    this.route.data.pipe(map((res) => res.sheetInfo)).subscribe((res) => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
      this.listenCurrent();
    });
  }

  ngOnInit() {}

  // 监听当前正在播放的歌曲
  private listenCurrent() {
    // takeUntil(this.destroy$) 表示当this.destroy$发射流的时候停止监听
    this.store$
      .pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destroy$))
      .subscribe((song) => {
        this.currentSong = song;
        if (song) {
          this.currentIndex = findSongIndex(this.sheetInfo.tracks, song);
        } else {
          this.currentIndex = -1;
        }
      });
  }

  private changeDesc(desc: string) {
    if (desc.length < 99) {
      this.description = {
        short: '<b>介绍:</b>' + this.replaceBr(desc),
        long: '',
      };
    } else {
      this.description = {
        short: '<b>介绍:</b>' + this.replaceBr(desc.slice(0, 99)) + '...',
        long: '<b>介绍:</b>' + this.replaceBr(desc),
      };
    }
  }

  private replaceBr(str: string): string {
    return str.replace(/\n/g, '<br/>');
  }

  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = '收起';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = '展开';
      this.controlDesc.iconCls = 'down';
    }
  }

  // 添加一首歌曲
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

  // 收藏歌单
  onLikeSheet(id: string, subscribed) {
    const t = subscribed ? 2 : 1;
    const tip = subscribed ? '取消收藏' : '收藏';
    this.memberServe.likeSheet(id, t).subscribe(
      () => {
        this.nzToolClass.alertMessage('success', `${tip}成功`);
        this.sheetInfo.subscribed = !subscribed;
      },
      (error) => {
        this.nzToolClass.alertMessage('error', error.msg || `${tip}失败`);
      }
    );
  }

  // 收藏歌曲
  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id);
  }

  // 分享
  shareResource(resource: Song | SongSheet, type = 'song') {
    let txt;
    if (type === 'playlist') {
      txt = this.makeTxt(
        '歌单',
        resource.name,
        (resource as SongSheet).creator.nickname
      );
    } else {
      txt = this.makeTxt('歌曲', resource.name, (resource as Song).ar);
    }
    this.store$.dispatch(
      SetShareInfo({ info: { id: resource.id.toString(), type, txt } })
    );
  }

  private makeTxt(
    type: string,
    name: string,
    makeBy: string | Singer[]
  ): string {
    let makeByStr;
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map((item) => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }
    return `${type}:${name}--${makeByStr}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
