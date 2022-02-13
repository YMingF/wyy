import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../service/home.service';
import {Banner, HotTag, SongSheet} from '../../service/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
   carouselActiveIndex = 0;
   banners: Banner[];
   HotTags: HotTag[];
   songSheetList: SongSheet[];
   @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

   constructor(private homeService: HomeService) {
      this.getBanners();
      this.getHotTags();
      this.getPersonalizedSheetList();
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

   OnBeforeChange({to}: { to: number }) {
      this.carouselActiveIndex = to;
   };

   onChangeSlide(type: 'pre' | 'next') {
      this.nzCarousel[type]();//调用此component里已设定好的pre()或next() 函数
   }

   ngOnInit(): void {

   }

}
