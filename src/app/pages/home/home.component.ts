import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../service/home.service';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {SingerService} from '../../service/singer.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../service/sheet.service';
import {select, Store} from '@ngrx/store';
import {AppStoreModule} from '../../store';
import {SetCurrentIndex, SetPlayList, SetSongList} from '../../store/actions/player.action';
import {PlayState} from '../../store/reducers/player.reducer';
import {getPlayer} from '../../store/selectors/player.selector';
import {findSongIndex, shuffle} from '../../utils/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

  carouselActiveIndex = 0;
  banners: Banner[];
  HotTags: HotTag[];
  singers: Singer[];
  songSheetList: SongSheet[];
  playerState: PlayState;

  constructor(
    private homeService: HomeService,
    private singerService: SingerService,
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>
  ) {
    // 获取总的State的值
    this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
    this.route.data.pipe(map(res => res['homeData'])).subscribe(([banners, tags, sheets, singer]) => {
      this.banners = banners;
      this.HotTags = tags;
      this.songSheetList = sheets;
      this.singers = singer;
    });
  }

  OnBeforeChange({to}: { to: number }) {
    this.carouselActiveIndex = to;
  };

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();//调用此component里已设定好的pre()或next() 函数
  }

  ngOnInit(): void {

  }

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({songList: list}));
      let playList = list.slice();
      let index = 0;
      // 用于处理先切换播放模式，后点击歌单播放时，保证随机切歌的正确
      if (this.playerState.playMode.type === 'random') {
        playList = shuffle(list);
        index = findSongIndex(playList, list[index]);
      }
      this.store$.dispatch(SetPlayList({playList}));
      this.store$.dispatch(SetCurrentIndex({currentIndex: index}));
    });
  }
}
