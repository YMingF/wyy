import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import {
  AfterViewInit,
  Inject,
  Renderer2,
  ViewChild
} from '@angular/core';
import { select, Store } from "@ngrx/store";
import { AppStoreModule } from "../../../../store";
import { getModalType, getModalVisible } from "../../../../store/selectors/member.selector";
import { BlockScrollStrategy, OverlayRef, Overlay, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from "../../../../store/reducers/member.reducer";
import { APOSTROPHE } from '@angular/cdk/keycodes';
import { DOCUMENT } from "@angular/common";
import { WINDOW } from "../../../../service/service.module";

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modalContainer', {static: false}) private modalRef: ElementRef;
  visible = false;
  currentModalType = ModalTypes.Default;
  overlayRef: OverlayRef;
  showModal = false;
  scrollStrategy: BlockScrollStrategy;
  private resizeHandler:()=>void;
  constructor(
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionServe: BatchActionsService,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc:Document,
    @Inject(WINDOW) private win:Window,
  ) {
    // @ts-ignore
    const appStore$ = this.store$.pipe(select("member"));
    appStore$.pipe(select(getModalVisible)).subscribe(visible => {
      this.watchModalVisible(visible);
    });
    appStore$.pipe(select(getModalType)).subscribe(type => {
      this.watchModalType(type);
    });
    this.scrollStrategy=this.overlay.scrollStrategies.block();
  }

  watchModalVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible;
      this.handleVisibleChange(visible);
    }
  }

  watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      this.currentModalType = type;
    }
  }

  ngOnInit() {
    this.createOverlay();
  }

  ngAfterViewInit(): void {
    this.listenResizeToCenter();

  }
  private listenResizeToCenter(){
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    // 改变页面大小的同时修改弹窗的位置
    this.resizeHandler=this.rd.listen('window', 'resize', () => {
      this.keepCenter(modal, modalSize);
    });
  }
  getHideDomSize(dom: HTMLElement) {
    console.log('dom', dom);
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    };
  }

  // 获取窗口的宽高
  getWindowSize() {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight,
    };
  }

  // 让登录弹窗居中:left=（ 整个窗口宽-弹窗宽）/2
  keepCenter(modal: HTMLElement, size: { w: number, h: number }) {
    const left = (this.getWindowSize().w - size.w) / 2;
    const top = (this.getWindowSize().h - size.h) / 2;
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }

  handleVisibleChange(visible) {
    this.showModal = visible;

    if (visible) {
      this.scrollStrategy.enable();//锁住滚动条
      // 在指定的ref上面监听键盘事件
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
    } else {
      this.scrollStrategy.disable();//放开滚动条，即可以滚动
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler(); // 调用，即解绑resize事件 的监听
    }
    this.cdr.markForCheck();
  }

  // 创建一个可以放置元素的浮层
  createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => {
      this.keyDownListener(e);
    });
  }

  keyDownListener(e: KeyboardEvent) {
    // tab上方的单引号
    if (e.keyCode===APOSTROPHE){
    this.hide()
  }
  }
  hide(){
    this.batchActionServe.controlModal(false);
  }
}
