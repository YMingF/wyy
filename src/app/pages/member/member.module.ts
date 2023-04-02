import { NgModule } from '@angular/core';

import { MemberRoutingModule } from './member-routing.module';
import { CenterComponent } from './center/center.component';
import { ShareModule } from '../../share/share.module';
import { RecordsComponent } from './components/records/records.component';
import { NzDividerModule, NzTableModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [CenterComponent, RecordsComponent],
  imports: [ShareModule, MemberRoutingModule, NzTableModule, NzDividerModule],
})
export class MemberModule {}
