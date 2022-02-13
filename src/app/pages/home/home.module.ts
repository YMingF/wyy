import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {ShareModule} from '../../share/share.module';
import {HomeComponent} from './home.component';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';
import {WyCarouselComponent} from './components/wy-carousel/wy-carousel.component';
import {NzIconModule} from 'ng-zorro-antd/icon';


@NgModule({
   declarations: [
      HomeComponent,
      WyCarouselComponent
   ],
   imports: [
      HomeRoutingModule,
      ShareModule,
      NzCarouselModule,
      NzIconModule
   ]
})
export class HomeModule {}
