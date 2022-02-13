import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from '../../service/home.service';
import {Banner} from '../../service/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
   carouselActiveIndex = 0;
   banners: Banner[] = [];
   @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;

   constructor(private homeService: HomeService) {
      this.homeService.getBanners().subscribe(banners => {
         this.banners = banners;
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
