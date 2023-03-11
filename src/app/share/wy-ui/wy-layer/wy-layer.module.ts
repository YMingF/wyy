import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { NzButtonModule, NzSpinModule } from "ng-zorro-antd";
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { DragDropModule } from "@angular/cdk/drag-drop";



@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent],
  imports: [
    CommonModule,
    NzSpinModule,
    NzButtonModule,
    DragDropModule
  ],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent]
})
export class WyLayerModule { }
