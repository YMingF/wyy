import { Inject, Injectable } from '@angular/core';
import { API_CONFIG, ServiceModule } from './service.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginParams, sampleBack } from "./data-types/common.types";
import { Observable } from "rxjs";
import { User } from "./data-types/member.type";
import * as querystring from "querystring";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: ServiceModule
})
export class MemberService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) {
  }

  login(formValue: LoginParams): Observable<User> {
    const params = new HttpParams({fromString: querystring.stringify(formValue)});
    return this.http.get(this.url + 'login/cellphone', {params}).pipe(map((res) => res as User));
  }

  // 获取用户详情
  getUserDetail(uid: string): Observable<User> {
    const params = new HttpParams({fromString: querystring.stringify(uid)});
    return this.http.get(this.url + 'user/detail', {params}).pipe(map((res) => res as User));
  }

  //退出登录
  logOut(): Observable<sampleBack> {
    return this.http.get(this.url + 'logout').pipe(map(res => res as sampleBack));
  }
}
