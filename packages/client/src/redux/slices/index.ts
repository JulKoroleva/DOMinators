export {
  authorizationSlice,
  clearAuthorizationState,
  registrationSlice,
  clearRegistrationState,
  forumSlice,
  clearForumState,
} from './pagesSlices';
export type {
  IAuthorizationFormSubmit,
  IAuthorizationSlice,
  IRegistrationFormSubmit,
  IRegistrationSlice,
  IForumSlice,
} from './pagesSlices';
export { userSlice, clearUserState, clearChangeUserState } from './globalSlices';
export type { IUserSlice, IUserInfo, IUserPassword } from './globalSlices';
