import {NgModule} from '@angular/core';
import {SheetInfoRoutingModule} from './sheet-info-routing.module';
import {SheetInfoComponent} from './sheet-info.component';
import {ShareModule} from '../../share/share.module';
import {NzIconModule, NzMessageModule, NzTableModule, NzTagModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [SheetInfoComponent,],
  imports: [
    ShareModule,
    SheetInfoRoutingModule,
    NzTableModule,
    NzIconModule,
    NzTagModule,
    NzMessageModule
  ]
})
export class SheetInfoModule { }
