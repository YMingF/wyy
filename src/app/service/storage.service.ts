import { Inject, Injectable } from '@angular/core';
import { WINDOW } from './service.module';
import { AnyJson } from './data-types/common.types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(WINDOW) private win: Window) {}

  getStorage(key: string, type = 'local'): string {
    return window[type + 'Storage'] && window[type + 'Storage'].getItem(key);
  }

  setStorage(params: AnyJson | AnyJson[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const { key, value } of kv) {
      window[type + 'Storage'] &&
        window[type + 'Storage'].setItem(key, value.toString());
    }
  }

  removeStorage(params: string | string[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const key of kv) {
      window[type + 'Storage'] && window[type + 'Storage'].removeItem(key);
    }
  }
}
