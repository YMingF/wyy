import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {WySliderStyle} from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-track',
  template: `
    <div class="wy-slider-track" [class.buffer]="wyBuffer" [ngStyle]="style"></div>`,
  changeDetection:ChangeDetectionStrategy.OnPush // 在Input属性变化的时候才更新
})
export class WySliderTrackComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;// 当前是否为垂直模式的进度条
  @Input() wyLength: number;// 当前进度条的长度
  @Input() wyBuffer= false;
  style: WySliderStyle = {};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wyLength']) {
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        // 置为null是为了避免水平和垂直的切换过程出现问题
        this.style.width = null;
        this.style.left = null;
      } else {
        this.style.width = this.wyLength + '%';
        // 置为null是为了避免水平和垂直的切换过程出现问题
        this.style.height = null;
        this.style.bottom = null;
      }
    }
  }
}
