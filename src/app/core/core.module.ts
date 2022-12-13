import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceModule} from '../service/service.module';
import {PagesModule} from '../pages/pages.module';
import {ShareModule} from '../share/share.module';
import zh from '@angular/common/locales/zh';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {AppStoreModule} from '../store';

registerLocaleData(zh);

@NgModule({
   declarations: [],
   imports: [
      CommonModule,
      BrowserModule,
      HttpClientModule,
      BrowserAnimationsModule,
      ServiceModule,
      PagesModule,
      ShareModule,
      AppRoutingModule,
     AppStoreModule
   ],
   providers: [{provide: NZ_I18N, useValue: zh_CN}],
   exports: [
      ShareModule,
      AppRoutingModule
   ]
})
export class CoreModule {
   constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
      if (parentModule) {
         throw  new Error('CoreModule只能被appModule引入');
      }
   }
}
