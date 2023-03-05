import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, pluck } from "rxjs/internal/operators";

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: ['./wy-search.component.less']
})
export class WySearchComponent implements OnInit, AfterViewInit {
  @ViewChild('nzInput', {static: false}) private nzInput: ElementRef;
  @Output() private onSearch = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    fromEvent(this.nzInput.nativeElement, 'input').pipe(
      debounceTime(300),//请求间隔超过300ms才会触发
      distinctUntilChanged(),
      pluck('target', 'value')
    ).subscribe((val:string) => {
      this.onSearch.emit(val);
    });
  }
}
