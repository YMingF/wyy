import { Inject, Injectable } from '@angular/core';
import { WINDOW } from "./service.module";
import { AnyJson } from "./data-types/common.types";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(WINDOW) private win: Window) {
  }

  getStorage(key: string, type = 'local'): string {
    return this.win[type + 'Storage'] && this.win[type + 'Storage'].getItem(key);
  }

  setStorage(params: AnyJson | AnyJson[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const {key, value} of kv) {
      this.win[type + 'Storage'] && this.win[type + 'Storage'].setItem(key, value.toString());
    }
  }

  removeStorage(params: string | string[], type = 'local') {
    const kv = Array.isArray(params) ? params : [params];
    for (const key of kv) {
      this.win[type + 'Storage'] && this.win[type + 'Storage'].removeItem(key);
    }
  }
}
