import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {ShareModule} from '../../share/share.module';
import {HomeComponent} from './home.component';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {WyCarouselComponent} from './components/wy-carousel/wy-carousel.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { NzToolTipModule } from "ng-zorro-antd";


@NgModule({
   declarations: [
      HomeComponent,
      WyCarouselComponent,
      MemberCardComponent
   ],
  imports: [
    HomeRoutingModule,
    ShareModule,
    NzCarouselModule,
    NzIconModule,
    NzToolTipModule
  ]
})
export class HomeModule {}
