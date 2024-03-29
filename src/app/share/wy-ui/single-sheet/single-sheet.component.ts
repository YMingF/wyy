import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {SongSheet} from '../../../service/data-types/common.types';

@Component({
   selector: 'app-single-sheet',
   templateUrl: './single-sheet.component.html',
   styleUrls: ['./single-sheet.component.less'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSheetComponent implements OnInit {
   @Input() sheet: SongSheet;
   @Output() onPlay = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  playSheet(evt: MouseEvent, id: number) {
    evt.stopPropagation();
    this.onPlay.emit(id);
  }

  get coverImg(): string {
    return this.sheet.picUrl || this.sheet.coverImgUrl;
  }
}
