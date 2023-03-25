import { NzMessageService } from 'ng-zorro-antd';
export function isEmptyObject(obj: Object): boolean {
  return JSON.stringify(obj) === '{}';
}

export class NzToolClass {
  constructor(private messageServe: NzMessageService) {}

  public alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg);
  }
}
