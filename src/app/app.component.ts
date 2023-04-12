import { Component } from '@angular/core';
import { SearchService } from './service/search.service';
import {
  LoginParams,
  SearchResult,
  SongSheet,
} from './service/data-types/common.types';
import { isEmptyObject, NzToolClass } from './utils/tools';
import { ModalTypes, ShareInfo } from './store/reducers/member.reducer';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from './store';
import {
  SetModalType,
  SetModalVisible,
  SetUserId,
} from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import {
  LikeSongParams,
  MemberService,
  ShareParams,
} from './service/member.service';
import { User } from './service/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { StorageService } from './service/storage.service';
import {
  getLikeId,
  getMember,
  getModalType,
  getModalVisible,
  getShareInfo,
} from './store/selectors/member.selector';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { interval, Observable } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/internal/operators';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

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
  mySheets: SongSheet[];
  // 被收藏歌曲的id
  likeId: string;

  // 弹窗显示
  visible = false;

  // 弹窗类型
  currentModalType = ModalTypes.Default;
  shareInfo: ShareInfo;

  // 标题
  routeTitle: string;
  private navEnd: Observable<NavigationEnd>;
  loadPercent = 0;
  constructor(
    private searchServe: SearchService,
    private memberServe: MemberService,
    private store$: Store<AppStoreModule>,
    private batchActionServe: BatchActionsService,
    private messageServe: NzMessageService,
    private storageServe: StorageService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private titleServe: Title
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
    this.listenStates();
    // 导航开始时进行操作
    this.router.events
      .pipe(filter((evt) => evt instanceof NavigationStart))
      .subscribe(() => {
        this.loadPercent = 0;
        this.setTitle();
      });
    // 从路由的所有事件中筛选出NavigationEnd事件
    this.navEnd = this.router.events.pipe(
      filter((evt) => evt instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;
    this.setLoadingBar();
  }

  private setLoadingBar() {
    interval(100)
      .pipe(takeUntil(this.navEnd))
      .subscribe(() => {
        this.loadPercent = Math.min(++this.loadPercent, 95);
      });
    // 导航结束事件发生的时候会发出一个流，可用subscribe进行监听
    this.navEnd.subscribe(() => {
      this.loadPercent = 100;
    });
  }

  setTitle() {
    this.navEnd
      .pipe(
        map(() => this.activateRoute), // 转成ActivatedRoute类型
        map((route: ActivatedRoute) => {
          while (route.firstChild) {
            // 若此路由下有多个子路由，则只获取第一个子路由
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.routeTitle = data['title'];
        this.titleServe.setTitle(this.routeTitle);
      });
  }

  private listenStates() {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getLikeId)).subscribe((id) => this.watchLikeId(id));
    appStore$
      .pipe(select(getModalVisible))
      .subscribe((visible) => this.watchModalVisible(visible));
    appStore$
      .pipe(select(getModalType))
      .subscribe((type) => this.watchModalType(type));
    appStore$
      .pipe(select(getShareInfo))
      .subscribe((info) => this.watchShareInfo(info));
  }
  private watchModalVisible(visible: boolean) {
    if (this.visible !== visible) {
      this.visible = visible;
    }
  }
  private watchModalType(type: ModalTypes) {
    if (this.currentModalType !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets();
      }
      this.currentModalType = type;
    }
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }
  // 收藏歌曲
  onLikeSong(args: LikeSongParams) {
    this.memberServe.likeSong(args).subscribe(
      () => {
        this.closeModal();
        this.nzToolClass.alertMessage('success', '收藏成功!');
      },
      (error) => {
        this.nzToolClass.alertMessage('error', error.msg || '收藏失败');
      }
    );
  }

  onCreateSheet(sheetName: string) {
    this.memberServe.createSheet(sheetName).subscribe(
      (pid) => {
        this.onLikeSong({ pid, tracks: this.likeId });
      },
      (error) => {
        this.nzToolClass.alertMessage('error', error.msg || '新建失败');
      }
    );
  }

  private watchShareInfo(info: ShareInfo) {
    if (!info) {
      return;
    }
    if (this.user) {
      this.shareInfo = info;
    }
    this.openModal(this.user ? ModalTypes.Share : ModalTypes.Default);
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
    const { data: user } = userData;
    this.user = user;
    this.nzToolClass.alertMessage('success', '登陆成功!');
    this.closeModal();
    this.storageServe.setStorage({
      key: 'wyUserId',
      value: user.profile.userId,
    });
    this.store$.dispatch(SetUserId({ id: user.profile.userId.toString() }));
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
  // 获取当前用户的歌单
  onLoadMySheets() {
    if (this.user) {
      this.memberServe
        .getUserSheets(this.user.profile.userId.toString())
        .subscribe((userSheet) => {
          this.mySheets = userSheet.self;
          this.store$.dispatch(SetModalVisible({ modalVisible: true }));
        });
    } else {
      this.openModal(ModalTypes.Default);
    }
  }

  readonly ModalTypes = ModalTypes;

  closeModal() {
    this.batchActionServe.controlModal(false);
  }

  onShare(arg: ShareParams) {
    this.memberServe.shareResource(arg).subscribe(
      () => {
        this.nzToolClass.alertMessage('success', '分享成功');
        this.closeModal();
      },
      (error) => {
        this.nzToolClass.alertMessage('error', error.msg || '分享失败');
      }
    );
  }
}
