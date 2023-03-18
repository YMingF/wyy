import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";



@NgModule({
  declarations: [WyLayerModalComponent, WyLayerDefaultComponent, WyLayerLoginComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [WyLayerModalComponent, WyLayerDefaultComponent,WyLayerLoginComponent]
})
export class WyLayerModule { }
