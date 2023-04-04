import { NgModule } from '@angular/core';

import { MemberRoutingModule } from './member-routing.module';
import { CenterComponent } from './center/center.component';
import { ShareModule } from '../../share/share.module';
import { RecordsComponent } from './components/records/records.component';
import { NzDividerModule, NzTableModule } from 'ng-zorro-antd';
import { RecordDetailComponent } from './record-detail/record-detail.component';

@NgModule({
  declarations: [CenterComponent, RecordsComponent, RecordDetailComponent],
  imports: [ShareModule, MemberRoutingModule, NzTableModule, NzDividerModule],
})
export class MemberModule {}
