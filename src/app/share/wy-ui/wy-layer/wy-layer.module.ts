import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyLayerModalComponent } from './wy-layer-modal/wy-layer-modal.component';
import { WyLayerDefaultComponent } from './wy-layer-default/wy-layer-default.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WyLayerLoginComponent } from './wy-layer-login/wy-layer-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { WyLayerRegisterComponent } from './wy-layer-register/wy-layer-register.component';
import { WyLayerLikeComponent } from './wy-layer-like/wy-layer-like.component';
import { WyLayerShareComponent } from './wy-layer-share/wy-layer-share.component';
import { WyCheckCodeComponent } from './wy-check-code/wy-check-code.component';
import { WyCodeComponent } from './wy-check-code/wy-code/wy-code.component';

@NgModule({
  declarations: [
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    WyLayerLoginComponent,
    WyLayerRegisterComponent,
    WyLayerLikeComponent,
    WyLayerShareComponent,
    WyCheckCodeComponent,
    WyCodeComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  exports: [
    WyLayerModalComponent,
    WyLayerDefaultComponent,
    WyLayerLoginComponent,
    WyLayerRegisterComponent,
    WyLayerLikeComponent,
    WyLayerShareComponent,
    WyCheckCodeComponent,
    WyCodeComponent,
  ],
})
export class WyLayerModule {}
