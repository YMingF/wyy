import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { SongSheet } from '../../../../service/data-types/common.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LikeSongParams } from '../../../../service/member.service';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input() mySheets: SongSheet[];
  @Input() likeId: string;
  @Input() visible: boolean;
  @Output() onLikeSong = new EventEmitter<LikeSongParams>();
  @Output() onCreateSheet = new EventEmitter<string>();
  creating = false;
  formModel: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formModel = this.fb.group({
      sheetName: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible) {
      if (!this.visible) {
        this.formModel.get('sheetName').reset();
        this.creating = false;
      }
    }
  }

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId });
  }

  onSubmit() {
    this.onCreateSheet.emit(this.formModel.get('sheetName').value);
  }
}
