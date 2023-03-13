import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { NzButtonModule, NzSpinModule } from "ng-zorro-antd";
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';



@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent],
  imports: [
    CommonModule,
    NzSpinModule,
    NzButtonModule,
    DragDropModule
  ],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent,WyLayerLoginComponent]
})
export class WyLayerModule { }
