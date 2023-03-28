import { Inject, Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SampleBack } from './data-types/common.types';
import { Observable } from 'rxjs';
import { SignIn, User } from './data-types/member.type';
import { map } from 'rxjs/operators';
import queryString from 'query-string';

@Injectable({
  providedIn: ServiceModule,
})
export class MemberService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private url: string
  ) {}

  //根据key生成二维码
  generateCode(key: string) {
    const timestamp = new Date().getTime();
    const params = new HttpParams({
      fromString: queryString.stringify({ key, timestamp, qrimg: true }),
    });
    return this.http.get(this.url + 'login/qr/create', { params });
  }
  //检测二维码的扫描状态
  checkCodeStatus(key: string) {
    const timestamp = new Date().getTime();
    const params = new HttpParams({
      fromString: queryString.stringify({ key, timestamp }),
    });
    return this.http.get(this.url + 'login/qr/check', { params });
  }

  //获取生成二维码所需的key
  generateKey() {
    const timestamp = new Date().getTime();
    const params = new HttpParams({
      fromString: queryString.stringify({ timestamp }),
    });
    return this.http.get(this.url + 'login/qr/key', { params }).pipe(
      map((res: { data: { unikey: string } }) => {
        return res.data.unikey;
      })
    );
  }

  // 获取用户详情
  getUserDetail(uid: string): Observable<User> {
    const params = new HttpParams({
      fromString: queryString.stringify({ uid }),
    });
    return this.http
      .get(this.url + 'user/detail', { params })
      .pipe(map((res) => res as User));
  }
  // 获取登录状态
  getUserStatus(cookie: string) {
    return this.http.get(
      `https://netease-cloud-music-api-beta-lyart.vercel.app/login/status?cookie=${cookie}`
    );
  }
  //退出登录
  logOut(): Observable<SampleBack> {
    return this.http
      .get(this.url + 'logout')
      .pipe(map((res) => res as SampleBack));
  }

  //   签到
  signIn(): Observable<SignIn> {
    const params = new HttpParams({
      fromString: queryString.stringify({ type: 1 }),
    });
    return this.http
      .get(this.url + 'daily_signin', { params })
      .pipe(map((res) => res as SignIn));
  }
}
