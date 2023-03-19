import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginParams } from "../../../../service/data-types/common.types";

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit, OnChanges {
  @Input() wyRememberLogin: LoginParams;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onLogin = new EventEmitter<LoginParams>();
  formModel: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('触发了');
    const model = this.formModel;
    if (model.valid) {
      this.onLogin.emit(model.value);
    }

  }
  setModel({phone,password,remember}){
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember]
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes['wyRememberLogin'];
    if (userLoginParams) {
      let phone = '';
      let password = '';
      let remember = false;
      const value = userLoginParams.currentValue;
      if (value) {
        [phone, password, remember] = [value.phone, value.password, value.remember];
      }
      this.setModel({phone,password,remember});
    }
  }
}
