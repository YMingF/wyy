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
import { mergeMap, switchMap } from 'rxjs/operators';
import { forkJoin, interval, Observable, of } from 'rxjs';
import { MemberService } from '../../../../service/member.service';
import { createSelector, select, Store } from '@ngrx/store';
import { getModalVisible } from '../../../../store/selectors/member.selector';
import { AppStoreModule } from '../../../../store';
import { MemberState } from '../../../../store/reducers/member.reducer';

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WyLayerLoginComponent implements OnInit, OnChanges {
  @Input() wyRememberLogin: LoginParams;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onLogin = new EventEmitter<any>();
  @Output() isSpinning = new EventEmitter<boolean>();
  formModel: FormGroup;
  nzToolClass: NzToolClass;
  qrcodeImg: string;
  isScan = false;
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
    appStore$.pipe(select(getModalVisible)).subscribe((visible) => {
      if (visible) {
        this.getQrCode();
      }
    });
    this.nzToolClass = new NzToolClass(this.messageServe);
  }

  ngOnInit() {}

  getQrCode() {
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
        this.isScan = true;
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
  }

  getUserDetailByCookie(cookie: string) {
    this.isSpinning.emit(true);
    this.memberServe.getUserStatus(cookie).subscribe((res) => {
      this.onLogin.emit(res);
      this.isSpinning.emit(false);
    });
  }

  setModel({ phone, password, remember }) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParams = changes['wyRememberLogin'];
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
  }
}
