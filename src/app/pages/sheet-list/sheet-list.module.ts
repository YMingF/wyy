import {NgModule} from '@angular/core';
import {SheetListRoutingModule} from './sheet-list-routing.module';
import {SheetListComponent} from './sheet-list.component';
import {ShareModule} from '../../share/share.module';
import {NzPaginationModule, NzRadioModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [SheetListComponent],
  imports: [
    ShareModule,
    SheetListRoutingModule,
    NzRadioModule,
    NzPaginationModule
  ]
})
export class SheetListModule { }
