import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild, ElementRef, AfterViewInit, Input, SimpleChanges
} from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';

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
  private bs: BScroll;

  constructor() {
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
  }

  refresh() {
    // betterScroll自带API，作用：重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
    this.bs.refresh();
  }

  // 类似Vue中nextTick的考虑，需要等dom更新之后，你再去重置你的滚动条。
  refreshScroll() {
    setTimeout(() => {
      this.refresh();
    }, 50);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.refreshScroll();
    }
  }
}
