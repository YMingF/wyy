import { Component } from '@angular/core';
import { SearchService } from './service/search.service';
import { LoginParams, SearchResult } from './service/data-types/common.types';
import { isEmptyObject, NzToolClass } from './utils/tools';
import { ModalTypes } from './store/reducers/member.reducer';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store';
import { SetModalType, SetUserId } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { MemberService } from './service/member.service';
import { User } from './service/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { StorageService } from './service/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'wyy';
  menu = [
    {
      label: '发现',
      path: '/home',
    },
    {
      label: '歌单',
      path: '/sheet',
    },
  ];
  searchResult: any;
  user: User;
  wyRememberLogin: LoginParams;
  nzToolClass: NzToolClass;
  constructor(
    private searchServe: SearchService,
    private memberServe: MemberService,
    private store$: Store<AppStoreModule>,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService,
    private storageServe: StorageService
  ) {
    this.nzToolClass = new NzToolClass(messageServe);
    const userId = this.storageServe.getStorage('wyUserId');
    if (userId) {
      this.store$.dispatch(SetUserId({ id: userId }));

      this.memberServe.getUserDetail(userId).subscribe((user) => {
        this.user = user;
      });
    }
    const wyRememberLogin = this.storageServe.getStorage('wyRememberLogin');
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin);
    }
  }

  //改变弹窗类型
  onChangeModalType(type = ModalTypes.Default) {
    this.store$.dispatch(SetModalType({ modalType: type }));
  }

  // 打开弹窗
  openModal(type: ModalTypes) {
    this.batchActionServe.controlModal(true, type);
  }

  onSearch(keyWords: string) {
    if (keyWords) {
      this.searchServe.search(keyWords).subscribe((res) => {
        this.searchResult = this.highLightKeyWords(keyWords, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  // 将返回值里和搜索内容一致的数据设置颜色以高亮展示
  highLightKeyWords(keyWords: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keyWords, 'ig');
      ['artists', 'playlists', 'songs'].forEach((type) => {
        if (result[type]) {
          result[type].forEach((item) => {
            item.name = item.name.replace(
              reg,
              '<span class="highLight">$&</span>'
            );
          });
        }
      });
      return result;
    }
  }

  // 登录
  onLogin(userData) {
    this.user = userData;
    this.batchActionServe.controlModal(false);
    this.storageServe.setStorage({
      key: 'wyUserId',
      value: userData.profile.userId,
    });
    this.store$.dispatch(SetUserId({ id: userData.profile.userId.toString() }));
    // if (params.remember) {
    //   this.storageServe.setStorage({
    //     key: 'wyRememberLogin',
    //     value: JSON.stringify(codeJson(params)),
    //   });
    // } else {
    //   this.storageServe.removeStorage('wyRememberLogin');
    // }
  }

  onLogout() {
    this.memberServe.logOut().subscribe(
      () => {
        this.user = null;
        this.store$.dispatch(SetUserId({ id: '' }));
        this.nzToolClass.alertMessage('success', '退出成功');
        this.storageServe.removeStorage('wyUserId');
      },
      (error) => {
        this.nzToolClass.alertMessage('error', error.message || '退出失败');
      }
    );
  }
}
