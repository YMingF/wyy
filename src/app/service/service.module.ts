import { InjectionToken, NgModule } from '@angular/core';
import { httpInterceptorProvides } from './http-interceptors';
import { environment } from '../../environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    { provide: API_CONFIG, useValue: environment.production ? '/' : '/api/' },
    httpInterceptorProvides,
  ],
})
export class ServiceModule {}
