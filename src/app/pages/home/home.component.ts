import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../service/home.service';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {SingerService} from '../../service/singer.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../service/sheet.service';
import {BatchActionsService} from '../../store/batch-actions.service';

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

  constructor(
    private homeService: HomeService,
    private singerService: SingerService,
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionServe: BatchActionsService
  ) {
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
      this.batchActionServe.selectPlayList({list, index: 0});
    });
  }
}
