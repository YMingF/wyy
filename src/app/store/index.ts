import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {playerReducer} from './reducers/player.reducer';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../../environments/environment';
import { memberReducer } from "./reducers/member.reducer";


@NgModule({
  declarations: [],
  imports: [
    // 注册reducer
    StoreModule.forRoot({player: playerReducer,member:memberReducer}, {
      runtimeChecks: { // 用来检测不规范操作
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }

    }),
    StoreDevtoolsModule.instrument({
      maxAge: 20, // 最多记录20条state
      logOnly: environment.production
    })
  ]
})
export class AppStoreModule {
}
