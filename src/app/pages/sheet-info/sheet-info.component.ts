import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, takeUntil} from 'rxjs/internal/operators';
import {AppStoreModule} from '../../store/index';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {BatchActionsService} from '../../store/batch-actions.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Singer, Song, SongSheet} from '../../service/data-types/common.types';
import {SongService} from '../../service/song.service';
import {getCurrentSong, getPlayer} from '../../store/selectors/player.selector';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  sheetInfo: SongSheet;

  description = {
    short: '',
    long: ''
  };

  controlDesc = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };

  currentSong: Song;
  currentIndex = -1;
  private destroy$ = new Subject<void>();
  private appStore$: Observable<AppStoreModule>;
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description);
      }
      this.listenCurrent();
    });
  }

  ngOnInit() {
  }

  // 监听当前正在播放的歌曲
  private listenCurrent() {
    // takeUntil(this.destroy$) 表示当this.destroy$发射流的时候停止监听
    this.store$.pipe(
      select(getPlayer),
      select(getCurrentSong),
      takeUntil(this.destroy$)).subscribe(song => {
      console.log('song', song);
      this.currentSong = song;
    });
  }

  private changeDesc(desc: string) {
    if (desc.length < 99) {
      this.description = {
        short: '<b>介绍:</b>' + this.replaceBr(desc),
        long: ''
      };
    } else {
      this.description = {
        short: '<b>介绍:</b>' + this.replaceBr(desc.slice(0, 99)) + '...',
        long: '<b>介绍:</b>' + this.replaceBr(desc)
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
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          alert('无Url');
        }
      });
    }
  }

  onAddSongs(songs: Song[], isPlay = false) {

  }


  // 收藏歌单
  onLikeSheet(id: string) {

  }


  // 收藏歌曲
  onLikeSong(id: string) {
  }

  // 分享
  shareResource(resource: Song | SongSheet, type = 'song') {

  }

  private makeTxt(type: string, name: string, makeBy: string | Singer[]): string {
    return '';
  }


  private alertMessage(type: string, msg: string) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
