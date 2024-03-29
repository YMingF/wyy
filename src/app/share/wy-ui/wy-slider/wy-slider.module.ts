import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WySliderComponent} from './wy-slider.component';
import {WySliderTrackComponent} from './wy-slider-track.component';
import {WySliderHandleComponent} from './wy-slider-handle.component';


@NgModule({
  declarations: [WySliderComponent, WySliderHandleComponent, WySliderTrackComponent],
  imports: [
    CommonModule
  ],
  exports: [WySliderComponent],
  providers: [{provide: Document}]
})
export class WySliderModule {
}
