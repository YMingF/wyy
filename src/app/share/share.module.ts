import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {WyUiModule} from './wy-ui/wy-ui.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    WyUiModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    WyUiModule
  ]
})
export class ShareModule {}
