import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStoreModule } from '../../../../store';

import {
  BlockScrollStrategy,
  Overlay,
  OverlayContainer,
  OverlayKeyboardDispatcher,
  OverlayRef,
} from '@angular/cdk/overlay';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from '../../../../store/reducers/member.reducer';
import { APOSTROPHE } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHide', [
      state('show', style({ transform: 'scale(1)', opacity: 1 })),
      state('hide', style({ transform: 'scale(0)', opacity: 0 })),
      transition('show<=>hide', animate('0.1s')),
    ]),
  ],
})
export class WyLayerModalComponent implements OnInit, AfterViewInit, OnChanges {
  modalTitle = {
    register: '注册',
    loginByPhone: '手机登录',
    share: '分享',
    like: '收藏',
    default: '',
  };
  @Input() visible = false;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef;
  @Output() onLoadMySheets = new EventEmitter<void>();
  @Input() currentModalType = ModalTypes.Default;
  overlayRef: OverlayRef;
  showModal = 'hide';
  scrollStrategy: BlockScrollStrategy;
  private overlayContainerEl: HTMLElement;
  private resizeHandler: () => void;

  constructor(
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionServe: BatchActionsService,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document,
    private overlayContainerServe: OverlayContainer
  ) {
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !changes['visible'].firstChange) {
      this.handleVisibleChange(this.visible);
    }
  }
  ngOnInit() {
    this.createOverlay();
  }

  ngAfterViewInit(): void {
    this.listenResizeToCenter();
    // 拿到overlay的Dom
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
  }

  private listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    // 改变页面大小的同时修改弹窗的位置
    this.resizeHandler = this.rd.listen('window', 'resize', () => {
      this.keepCenter(modal, modalSize);
    });
  }
  getHideDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight,
    };
  }

  // 获取窗口的宽高
  getWindowSize() {
    return {
      w:
        window.innerWidth ||
        this.doc.documentElement.clientWidth ||
        this.doc.body.offsetWidth,
      h:
        window.innerHeight ||
        this.doc.documentElement.clientHeight ||
        this.doc.body.offsetHeight,
    };
  }

  // 让登录弹窗居中:left=（ 整个窗口宽-弹窗宽）/2
  keepCenter(modal: HTMLElement, size: { w: number; h: number }) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }

  handleVisibleChange(visible) {
    this.showModal = visible ? 'show' : 'hide';

    if (visible) {
      this.scrollStrategy.enable(); //锁住滚动条
      // 在指定的ref上面监听键盘事件
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.scrollStrategy.disable(); //放开滚动条，即可以滚动
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler(); // 调用，即解绑resize事件 的监听
      this.changePointerEvents('none');
    }
    this.cdr.markForCheck();
  }

  // 创建一个可以放置元素的浮层
  createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe((e) => {
      this.keyDownListener(e);
    });
  }

  keyDownListener(e: KeyboardEvent) {
    // tab上方的单引号
    if (e.keyCode === APOSTROPHE) {
      this.hide();
    }
  }

  hide() {
    this.batchActionServe.controlModal(false);
  }

  changePointerEvents(type: 'auto' | 'none') {
    if (this.overlayContainerEl) {
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }
}
