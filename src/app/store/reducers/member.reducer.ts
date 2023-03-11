import {Action, createReducer, on} from '@ngrx/store';
import { SetModalType, SetModalVisible } from "../actions/member.action";

export enum ModalTypes{
  Register='register',
  LoginByPhone='loginByPhone',
  Share='share',
  Like='like',
  Default='default'
}
export type MemberState={
  modalVisible:boolean;
  modalType:ModalTypes
}

export const initialState: MemberState = {
  modalVisible:false,
  modalType:ModalTypes.Default
};

const reducer = createReducer(
  initialState,
  // 注册动作
  on(SetModalVisible, (state, {modalVisible}) => ({...state, modalVisible})),
  on(SetModalType, (state, {modalType}) => ({...state, modalType})),
);
// 固定写法，只不过导出的函数名可以自己取
export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action);
}

