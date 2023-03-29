import { NgModule } from '@angular/core'

import { MemberRoutingModule } from './member-routing.module'
import { CenterComponent } from './center/center.component'
import { ShareModule } from '../../share/share.module'

@NgModule({
  declarations: [CenterComponent],
  imports: [ShareModule, MemberRoutingModule],
})
export class MemberModule {}
