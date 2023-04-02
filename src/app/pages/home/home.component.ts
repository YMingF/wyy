import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../../service/home.service';
import {
  Banner,
  HotTag,
  Singer,
  SongSheet,
} from '../../service/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { SingerService } from '../../service/singer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SheetService } from '../../service/sheet.service';
import { BatchActionsService } from '../../store/batch-actions.service';
import { ModalTypes } from '../../store/reducers/member.reducer';
import { AppStoreModule } from '../../store';
import { select, Store } from '@ngrx/store';
import { getMember, getUserId } from '../../store/selectors/member.selector';
import { MemberService } from '../../service/member.service';
import { User } from '../../service/data-types/member.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;
  carouselActiveIndex = 0;
  banners: Banner[];
  HotTags: HotTag[];
  singers: Singer[];
  songSheetList: SongSheet[];
  user: User;

  constructor(
    private homeService: HomeService,
    private singerService: SingerService,
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionServe: BatchActionsService,
    private router: Router,
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService
  ) {
    this.route.data
      .pipe(map((res) => res['homeData']))
      .subscribe(([banners, tags, sheets, singer]) => {
        this.banners = banners;
        this.HotTags = tags;
        this.songSheetList = sheets;
        this.singers = singer;
      });
    this.store$.pipe(select(getMember), select(getUserId)).subscribe((id) => {
      if (id) {
        this.getUserDetail(id);
      } else {
        this.user = null;
      }
    });

    this.memberServe.generateKey().subscribe((key) => {
      this.memberServe.generateCode(key).subscribe((item) => {});
    });
  }

  getUserDetail(id: string) {
    this.memberServe.getUserDetail(id).subscribe((res) => {
      this.user = res;
    });
  }

  OnBeforeChange({ to }: { to: number }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type](); //调用此component里已设定好的pre()或next() 函数
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe((list) => {
      this.batchActionServe.selectPlayList({ list, index: 0 });
    });
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }
  openModal() {
    this.batchActionServe.controlModal(true, ModalTypes.Default);
  }
}
