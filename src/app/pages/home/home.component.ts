import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../service/home.service';
import {Banner, HotTag, Singer, SongSheet} from '../../service/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';
import {SingerService} from '../../service/singer.service';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
   carouselActiveIndex = 0;
   banners: Banner[];
   HotTags: HotTag[];
   singers: Singer[];
   songSheetList: SongSheet[];
   @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

   constructor(private homeService: HomeService, private singerService: SingerService) {
      this.getBanners();
      this.getHotTags();
      this.getPersonalizedSheetList();
      this.getEnterSinger();
   }

   private getBanners() {
      this.homeService.getBanners().subscribe(banners => {
         this.banners = banners;
      });
   }

   private getHotTags() {
      this.homeService.getHotTags().subscribe(tags => {
         this.HotTags = tags;
      });
   }

   private getPersonalizedSheetList() {
      this.homeService.getPersonalSheetList().subscribe(sheets => {
         this.songSheetList = sheets;
      });
   }

   private getEnterSinger() {
      this.singerService.getEnterSinger().subscribe(singer => {
         this.singers = singer;
      });
      console.log('zhixing');
      console.log(this.singers);
   }

   OnBeforeChange({to}: { to: number }) {
      this.carouselActiveIndex = to;
   };

   onChangeSlide(type: 'pre' | 'next') {
      this.nzCarousel[type]();//调用此component里已设定好的pre()或next() 函数
   }

   ngOnInit(): void {

   }

}
