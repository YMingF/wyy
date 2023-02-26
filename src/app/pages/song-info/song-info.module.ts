import { NgModule } from '@angular/core';

import { SongInfoRoutingModule } from './song-info-routing.module';
import { ShareModule } from "../../share/share.module";
import { SongInfoComponent } from './song-info.component';
import { NzIconModule } from "ng-zorro-antd";


@NgModule({
  declarations: [SongInfoComponent],
    imports: [
        ShareModule,
        SongInfoRoutingModule,
        NzIconModule
    ]
})
export class SongInfoModule { }
