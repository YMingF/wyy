import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule, NzProgressModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    NzMenuModule,
    NzInputModule,
    NzLayoutModule,
    NzIconModule,
    FormsModule,
    NzAvatarModule,
    NzProgressModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
