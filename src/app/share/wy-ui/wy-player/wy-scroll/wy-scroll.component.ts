import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild, ElementRef, AfterViewInit, Input, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import {timer} from 'rxjs';

// @ts-ignore
BScroll.use(ScrollBar);
// @ts-ignore
BScroll.use(MouseWheel);

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit {
  @Input() data: any[];
  @ViewChild('wrap', {static: true}) private wrapRef: ElementRef;
  @Output() private onScrollEnd = new EventEmitter<number>();
  private bs: BScroll;

  constructor(readonly el: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollY: true,
      scrollbar: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
    // 获取滚动条已滚动距离
    this.bs.on('scrollEnd', ({y}) => this.onScrollEnd.emit(y));
  }

  refresh() {
    // betterScroll自带API，作用：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
    this.bs.refresh();
  }

  // 类似Vue中nextTick的考虑，需要等dom更新之后，你再去重置你的滚动条。
  refreshScroll() {
    timer(50).subscribe(() => {
      this.refresh();
    });
  }

  scrollToElement(...args) {
    /*scrollToElement(el, time, offsetX, offsetY, easing)
    * el：滚动到的目标元素
    * time 滚动动画执行的时长（单位 ms）
    * 后面这两个参数一般都设置成false
    * offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
    *  offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置 */
    this.bs.scrollToElement.apply(this.bs, args);
  }

  scrollTo(...args) {
    this.bs.scrollTo.apply(this.bs, args);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.refreshScroll();
    }
  }
}
