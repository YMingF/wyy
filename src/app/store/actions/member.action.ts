import { createAction, props } from '@ngrx/store';
import { ModalTypes, ShareInfo } from '../reducers/member.reducer';
// createAction的参数1用来描述这个动作在干啥
export const SetModalVisible = createAction(
  '[player] Set modal visible',
  props<{ modalVisible: boolean }>()
);
export const SetModalType = createAction(
  '[player] Set modal type',
  props<{ modalType: ModalTypes }>()
);
export const SetUserId = createAction(
  '[player] SetUserId',
  props<{ id: string }>()
);
export const SetLikeId = createAction(
  '[player] SetLikeId',
  props<{ id: string }>()
);
export const SetShareInfo = createAction(
  '[player] SetShareInfo',
  props<{ info: ShareInfo }>()
);
