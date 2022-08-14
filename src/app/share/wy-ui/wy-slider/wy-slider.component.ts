import {
  ChangeDetectionStrategy,
  Component,
  ElementRef, Inject, Input,
  OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, merge, Observable} from 'rxjs';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {SliderEventObserverConfig} from './wy-slider-types';
import {pluck} from 'rxjs/internal/operators';
import {sliderEvent} from './wy-slider-helper';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush // 当@Input属性改变时,才触发变更检测
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical = false;
  @ViewChild('wySlider', {static: true}) private wySlider: ElementRef;
  private sliderDom: HTMLDivElement;
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(Document) private doc: Document) {
  }

  ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
  }

  createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,//从事件中筛选出MouseEvent
      pluckKey: [orientField]
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent, //从事件中筛选出TouchEvent
      pluckKey: ['touches', '0', orientField]
    };
    [mouse, touch].forEach(source => {
      const {start, move, end, filter: filerFunc, pluckKey} = source;

      source.startPlucked$ = fromEvent(this.sliderDom, start)
        .pipe(
          filter(filerFunc),
          tap(sliderEvent),
          // pluck这里用来获取对应事件中鼠标点击的位置,pc端是event.pageX,event.pageY来获取横纵坐标,而手机端则是通过event.touches[0].pageX,event.touches[0].pageY获取
          pluck(...pluckKey),
          map((position: number) => this.findClosestValue(position))
        );
      // end和move都是绑定在document上
      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filerFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),// 当值发生改变时才继续往下发射流，否则不
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)//当end$流发出的时候，move这个流就要结束了
      );
      // merge用于合并Observable，这样后面只需要订阅这个整体就行，感觉挺像forkJoin
      this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
      this.dragEnd$ = merge(mouse.end$, touch.end$);
      this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);

    });
  }
  findClosestValue(position){

  }
}
