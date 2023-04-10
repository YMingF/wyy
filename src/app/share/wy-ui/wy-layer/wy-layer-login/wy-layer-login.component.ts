import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginParams } from '../../../../service/data-types/common.types';
import { codeJson } from '../../../../utils/base64';
import { NzToolClass } from '../../../../utils/tools';
import { NzMessageService } from 'ng-zorro-antd';
import { mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { MemberService } from '../../../../service/member.service';
import { createSelector, select, Store } from '@ngrx/store';
import {
  getModalType,
  getModalVisible,
} from '../../../../store/selectors/member.selector';
import { AppStoreModule } from '../../../../store';
import {
  MemberState,
  ModalTypes,
} from '../../../../store/reducers/member.reducer';

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLoginComponent implements OnInit, OnChanges {
  @Input() wyRememberLogin: LoginParams;
  @Input() visible = false;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onLogin = new EventEmitter<any>();
  isSpinning = false;
  formModel: FormGroup;
  nzToolClass: NzToolClass;
  qrcodeImg: string;
  isScan = false;
  codeExpire = false;
  constructor(
    private fb: FormBuilder,
    private store$: Store<AppStoreModule>,
    private messageServe: NzMessageService,
    private memberServe: MemberService,
    private cdr: ChangeDetectorRef
  ) {
    const selectMember = createSelector(
      (state: { member: MemberState }) => state.member,
      (member) => member
    );
    const appStore$ = this.store$.pipe(select(selectMember));
    // 同时获取弹窗是否可见，以及当前弹窗的类型，只有当是手机登录界面的时候，才去获取二维码
    appStore$
      .pipe(
        mergeMap(() =>
          appStore$.pipe(
            select(getModalVisible),
            withLatestFrom(appStore$.pipe(select(getModalType)))
          )
        )
      )
      .subscribe(([visible, modalType]) => {
        if (visible && modalType === ModalTypes.LoginByPhone) {
          this.generateQrCode();
        }
      });
    this.nzToolClass = new NzToolClass(this.messageServe);
  }

  ngOnInit() {}

  generateQrCode() {
    const observe$ = this.memberServe
      .generateKey()
      .pipe(
        switchMap((key) => {
          return forkJoin([
            of(key) as Observable<string>,
            this.memberServe.generateCode(key),
          ]);
        }),
        switchMap(([key, codeData]) => {
          this.qrcodeImg = codeData['data']['qrimg'];
          this.cdr.markForCheck();
          return interval(1500).pipe(
            mergeMap(() => {
              return this.memberServe.checkCodeStatus(key) as Observable<{
                code: number;
                cookie: string;
                message: string;
              }>;
            })
          );
        })
      )
      .subscribe((finalData) => {
        const { code } = finalData;
        this.isScan = code === 802;
        this.cdr.markForCheck();
        if ([800, 803].includes(code)) {
          const fnObj = {
            800: () => this.handleCodeExpire.bind(this),
            803: this.getUserDetailByCookie.bind(this, finalData.cookie),
          };

          fnObj[code]!.call();
          observe$.unsubscribe();
        }
      });
  }

  handleCodeExpire() {
    this.nzToolClass.alertMessage('error', '二维码已过期!');
    this.codeExpire = true;
  }

  getUserDetailByCookie(cookie: string) {
    this.isSpinning = true;
    this.memberServe.getUserStatus(cookie).subscribe((res) => {
      this.onLogin.emit(res);
      this.isSpinning = false;
    });
  }

  setModel({ phone, password, remember }) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember],
    });
  }

  refreshCode() {
    this.codeExpire = false;
    this.generateQrCode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes['wyRememberLogin'];
    const visible = changes['visible'];
    if (userLoginParams) {
      let phone = '';
      let password = '';
      let remember = false;
      if (userLoginParams.currentValue) {
        const value = codeJson(userLoginParams.currentValue, 'decode');
        [phone, password, remember] = [
          value.phone,
          value.password,
          value.remember,
        ];
      }
      this.setModel({ phone, password, remember });
    }
    if (visible && !visible.firstChange) {
      this.formModel.markAllAsTouched();
    }
  }
}
