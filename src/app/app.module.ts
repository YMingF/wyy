import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {FormsModule} from '@angular/forms';

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
     FormsModule
   ],
   bootstrap: [AppComponent]
})
export class AppModule {}
