import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[appClickOutSide]'
})
export class ClickOutSideDirective implements OnChanges {
  private handleClick: () => void; // 存放监听函数的结果，当调用这个函数时，对应的事件就解绑了。
  @Input() bindFlag = false; // true时绑定事件，false时解绑事件。
  @Output() private onClickOutside = new EventEmitter<void>();
  // el表示我们用指令操作的dom
  // rd为angular提供让我们操作Dom的
  constructor(private el: ElementRef, private rd: Renderer2, @Inject(DOCUMENT) private doc: Document) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bindFlag'] && !changes['bindFlag'].firstChange) {
      if (this.bindFlag) {
        this.handleClick = this.rd.listen(this.doc, 'click', (evt) => {
          const isContain = this.el.nativeElement.contains(evt.target); // 判断当前点击的对象是否包含在el中。
          if (!isContain) {
            this.onClickOutside.emit();
          }
        });
      } else {
        this.handleClick(); // 解绑
      }
    }
  }
}
