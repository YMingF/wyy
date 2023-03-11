import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from "@ngrx/store";
import { AppStoreModule } from "../../../../store";
import { getModalType, getModalVisible } from "../../../../store/selectors/member.selector";

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit {

  constructor(
    private store$:Store<AppStoreModule>
  ) {
    // @ts-ignore
    const appStore$=this.store$.pipe(select("member"));
    appStore$.pipe(select(getModalVisible)).subscribe(visible=>{
      console.log('visible', visible);
    })
    appStore$.pipe(select(getModalType)).subscribe(type=>{
      console.log('type', type);
    })
  }

  ngOnInit() {
  }

}
