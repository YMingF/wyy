import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, pluck } from "rxjs/internal/operators";
import { SearchResult } from "../../../service/data-types/common.types";
import { isEmptyObject } from "../../../utils/tools";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from '@angular/cdk/portal';
import { WySearchPanelComponent } from "./wy-search-panel/wy-search-panel.component";

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('nzInput', {static: false}) private nzInput: ElementRef;
  @ViewChild('search', {static: false}) private defaultRef: ElementRef;
  @Output() private onSearch = new EventEmitter<string>();
  @Input() searchResult: SearchResult;
  @Input() connectedRed: ElementRef; // 可供外界传入的元素，浮层将要展示在此元素上
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    fromEvent(this.nzInput.nativeElement, 'input').pipe(
      debounceTime(300),//请求间隔超过300ms才会触发
      distinctUntilChanged(),
      pluck('target', 'value')
    ).subscribe((val: string) => {
      this.onSearch.emit(val);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && !changes['searchResult'].firstChange) {
      if (!isEmptyObject(this.searchResult)) {
        this.showOverlayPanel();
      }else{
        this.showOverlayPanel()
      }
    }
  }

// 创建并将浮层展示到指定位置
  showOverlayPanel() {
    this.hideOverlayPanel();// 创建之前先隐藏掉之前的，避免创建多个

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.defaultRef)
      .withPositions([{
        // 用浮层的左上角
        overlayX: 'start',
        overlayY: "top",
        // 去对准将要贴的元素的左下角
        originX: "start",
        originY: "bottom",
      }]).withLockedPosition(true);//让浮层根据某个具体的dom定位
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),//用来确保浮层不会是position:fixed的效果，而是会随滚动而滚动位置
    }); // 浮层
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef); //在浮层上要展示的UI
    const panelRef = this.overlayRef.attach(panelPortal);// 将UI依附到浮层上展示
    panelRef.instance.searchResult=this.searchResult;
    //当你点击了由前面的hasBackdrop:true属性所创建的全屏图层时，就会触发backdropClick，返回一个Observable对象，你可以监听它，并决定你在触发时执行啥操作
    this.overlayRef.backdropClick().subscribe(() => {
      this.hideOverlayPanel();
    });
  }

//隐藏浮层
  hideOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached()) { // hasAttached表明这个overlay已经展示在界面上
      this.overlayRef.dispose();
    }
  }

  onFocus() {
    if (this.searchResult && !isEmptyObject(this.searchResult)) {
      this.showOverlayPanel();
    }
  }

  onBlur(){
    this.hideOverlayPanel();
  }

}
