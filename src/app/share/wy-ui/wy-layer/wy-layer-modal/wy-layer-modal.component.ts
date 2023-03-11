import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { select, Store } from "@ngrx/store";
import { AppStoreModule } from "../../../../store";
import { getModalType, getModalVisible } from "../../../../store/selectors/member.selector";
import { ModalTypes } from "../../../../store/reducers/member.reducer";
import { Overlay, OverlayKeyboardDispatcher, OverlayRef, BlockScrollStrategy } from "@angular/cdk/overlay";
import { BatchActionsService } from "../../../../store/batch-actions.service";
import {APOSTROPHE} from '@angular/cdk/keycodes'
@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit {
  visible=false;
  currentModalType=ModalTypes.Default;
  overlayRef: OverlayRef;
  showModal=false;
  scrollStrategy:BlockScrollStrategy
  constructor(
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr:ChangeDetectorRef,
    private batchActionServe: BatchActionsService,
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

  handleVisibleChange(visible) {
    this.showModal = visible;

    if (visible) {
      this.scrollStrategy.enable();//锁住滚动条
      // 在指定的ref上面监听键盘事件
      this.overlayKeyboardDispatcher.add(this.overlayRef);
    } else {
      this.scrollStrategy.disable();//放开滚动条，即可以滚动
      this.overlayKeyboardDispatcher.add(this.overlayRef);
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
