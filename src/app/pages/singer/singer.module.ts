import { NgModule } from '@angular/core';

import { SingerRoutingModule } from './singer-routing.module';
import { ShareModule } from '../../share/share.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { NzIconModule, NzTableModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [SingerDetailComponent],
  imports: [ShareModule, SingerRoutingModule, NzTableModule, NzIconModule],
})
export class SingerModule {}
