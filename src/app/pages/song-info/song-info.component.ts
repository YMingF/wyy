import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { Song } from "../../service/data-types/common.types";
import { WyLyric } from "../../share/wy-ui/wy-player/wy-player-panel/wy-lyric";
import { SongService } from "../../service/song.service";
import { select, Store } from "@ngrx/store";
import { getCurrentSong, getPlayer } from "../../store/selectors/player.selector";
import { takeUntil } from "rxjs/internal/operators";
import { AppStoreModule } from "../../store";
import { BatchActionsService } from "../../store/batch-actions.service";
import { NzMessageService } from "ng-zorro-antd";
import { Subject } from "rxjs";

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit, OnDestroy {
  song: Song;
  lyric;
  controlLyric = {
    isExpand: false,
    label: '展开',
    iconCls: 'down'
  };
  currentSong: Song;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private store$: Store<AppStoreModule>,
              private batchActionServe: BatchActionsService,
              private nzMessageServe: NzMessageService,
              private songServe: SongService,) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.lyric = new WyLyric(lyric).lines;
      this.listenCurrent();
    })

  }

  private listenCurrent() {
    // takeUntil(this.destroy$) 表示当this.destroy$发射流的时候停止监听
    this.store$.pipe(
      select(getPlayer),
      select(getCurrentSong),
      takeUntil(this.destroy$)).subscribe(song => {
      this.currentSong = song;
    });
  }

  onAddSong(song: Song, isPlay = false) {
    // 当前没正播放歌曲，或播放歌曲和想添加的歌曲不同时，才允许添加歌曲
    if (!this.currentSong || this.currentSong.id !== song.id) {
      // 获取歌曲的url，因为原数据song里没有url
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          this.nzMessageServe.create('warning', '无Url');
        }
      });
    }
  }

  onLikeSong() {
  }

  onShareSong() {
  }

  toggleLyric() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.label = '收起';
      this.controlLyric.iconCls = 'up';
    } else {
      this.controlLyric.label = '展开';
      this.controlLyric.iconCls = 'down';
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
