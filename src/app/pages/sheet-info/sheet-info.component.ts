import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/internal/operators';
import {AppStoreModule} from '../../store/index';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {BatchActionsService} from '../../store/batch-actions.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Singer, Song, SongSheet} from '../../service/data-types/common.types';
import {SongService} from '../../service/song.service';

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

  private listenCurrent() {

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

  }
}
