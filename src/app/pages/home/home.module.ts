import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {ShareModule} from '../../share/share.module';
import {HomeComponent} from './home.component';
import {NzCarouselModule} from 'ng-zorro-antd/carousel';


@NgModule({
   declarations: [
      HomeComponent
   ],
   imports: [
      HomeRoutingModule,
      ShareModule,
      NzCarouselModule,
   ]
})
export class HomeModule {}
