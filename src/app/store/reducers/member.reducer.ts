import { Action, createReducer, on } from '@ngrx/store';
import {
  SetLikeId,
  SetModalType,
  SetModalVisible,
  SetShareInfo,
  SetUserId,
} from '../actions/member.action';

export enum ModalTypes {
  Register = 'register',
  LoginByPhone = 'loginByPhone',
  Share = 'share',
  Like = 'like',
  Default = 'default',
}

export type ShareInfo = {
  id: string;
  type: string;
  txt: string;
};
export type MemberState = {
  modalVisible: boolean;
  modalType: ModalTypes;
  userId: string;
  likeId: string;
  shareInfo?: ShareInfo;
};

export const initialState: MemberState = {
  modalVisible: false,
  modalType: ModalTypes.Default,
  userId: '',
  likeId: '',
};

const reducer = createReducer(
  initialState,
  // 注册动作
  on(SetModalVisible, (state, { modalVisible }) => ({
    ...state,
    modalVisible,
  })),
  on(SetModalType, (state, { modalType }) => ({ ...state, modalType })),
  on(SetUserId, (state, { id }) => ({ ...state, userId: id })),
  on(SetLikeId, (state, { id }) => ({ ...state, likeId: id })),
  on(SetShareInfo, (state, { info }) => ({ ...state, shareInfo: info }))
);
// 固定写法，只不过导出的函数名可以自己取
export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}
