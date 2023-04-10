import { Inject, Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AnyJson, SampleBack, SongSheet } from './data-types/common.types';
import { Observable } from 'rxjs';
import {
  RecordVal,
  SignIn,
  User,
  UserRecord,
  UserSheet,
} from './data-types/member.type';
import { map } from 'rxjs/operators';
import queryString from 'query-string';

export enum RecordType {
  allData,
  weekData,
}
export type LikeSongParams = {
  pid: string;
  tracks: string;
};
export interface ShareParams {
  id: string;
  msg: string;
  type: string;
}
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
  // 听歌记录
  getUserRecord(
    uid: string,
    type = RecordType.weekData
  ): Observable<RecordVal[]> {
    const params = new HttpParams({
      fromString: queryString.stringify({ uid, type }),
    });
    return this.http
      .get(this.url + 'user/record', { params })
      .pipe(map((res: UserRecord) => res[RecordType[type]]));
  }
  // 用户歌单
  getUserSheets(uid: string): Observable<UserSheet> {
    const params = new HttpParams({
      fromString: queryString.stringify({ uid }),
    });
    return this.http.get(this.url + 'user/playlist', { params }).pipe(
      map((res: { playlist: SongSheet[] }) => {
        const list = res.playlist;
        return {
          self: list.filter((item) => !item.subscribed),
          subscribed: list.filter((item) => item.subscribed),
        };
      })
    );
  }

  // 收藏歌曲
  likeSong({ pid, tracks }: LikeSongParams): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ pid, tracks, op: 'add' }),
    });
    return this.http
      .get(this.url + 'playlist/tracks', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 收藏歌手
  likeSinger(id: string, t = 1): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ id, t }),
    });
    return this.http
      .get(this.url + 'artist/sub', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 新建歌单
  createSheet(name: string): Observable<string> {
    const params = new HttpParams({
      fromString: queryString.stringify({ name }),
    });
    return this.http
      .get(this.url + 'playlist/create', { params })
      .pipe(map((res: SampleBack) => res.id.toString()));
  }

  //收藏歌单
  likeSheet(id: string, t): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ id, t }),
    });
    return this.http
      .get(this.url + 'playlist/subscribe', { params })
      .pipe(map((res: AnyJson) => res.code));
  }

  //分享
  shareResource({ id, msg, type = 'song' }: ShareParams): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ id, msg, type }),
    });
    return this.http
      .get(this.url + 'share/resource', { params })
      .pipe(map((res: AnyJson) => res.code));
  }

  // 发送验证码
  sendCode(phone: number): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ phone }),
    });
    return this.http
      .get(this.url + 'captcha/sent', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 校验验证码
  checkCode(phone: number, captcha: number): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ phone, captcha }),
    });
    return this.http
      .get(this.url + 'captcha/verify', { params })
      .pipe(map((res: SampleBack) => res.code));
  }

  // 是否已注册
  checkExist(phone: number): Observable<number> {
    const params = new HttpParams({
      fromString: queryString.stringify({ phone }),
    });
    return this.http
      .get(this.url + 'cellphone/existence/check', { params })
      .pipe(map((res: SampleBack) => res.exist));
  }
}
