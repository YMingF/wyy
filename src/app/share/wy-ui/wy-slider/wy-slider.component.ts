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
import {inArray} from '../../../utils/array';
import {getElementOffset} from './wy-slider-helper';
import {limitNumberInRange} from '../../../utils/number';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush // 当@Input属性改变时,才触发变更检测
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
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
    this.subscribeDrag(['start']);
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
          filter(filerFunc), //filter就是一个筛选的功能,这里用来筛选出对应所需类型的事件
          tap(sliderEvent), // tap像console.log一样，用来在中间再拦截一次做调试
          pluck(...pluckKey),// pluck这里用来获取对应事件中鼠标点击的位置,pc端是event.pageX,event.pageY来获取横纵坐标,而手机端则是通过event.touches[0].pageX,event.touches[0].pageY获取
          map((position: number) => this.findClosestValue(position))
        );
      // end和move都是绑定在document上,这里使用angular中已经依赖注入过的document对象，this.doc
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
      this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
      this.dragEnd$ = merge(mouse.end$, touch.end$);
    });
  }


  subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  onDragStart(value: number) {
    console.log('value', value);
  }

  onDragMove(value: number) {
  }

  onDragEnd() {

  }

  // 将事件获取的鼠标位置的数值转换成百分比的值
  findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();
    // 滑块（左，上）端点位置
    const sliderStart = this.getSliderStart();
    // 滑块当前位置/总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    // 如果是纵向,ratio代表的比例是还可以调整音量的滑块所占总长的比例
    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }

  getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  getSliderStart(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }
}
