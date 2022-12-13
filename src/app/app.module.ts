import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FormsModule} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      CoreModule,
      NzMenuModule,
      NzInputModule,
      NzLayoutModule,
      NzIconModule,
     FormsModule,
     StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
     StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
   ],
   bootstrap: [AppComponent]
})
export class AppModule {}
