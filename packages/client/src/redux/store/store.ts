import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authenticationReducer } from '../reducers/pageReducers/authenticationReducer';
import { globalReducer } from '../reducers/globalReducers';

// Глобально декларируем в window наш ключ
// и задаем ему тип такой же, как у стейта в сторе
declare global {
  interface Window {
    APP_INITIAL_STATE: RootState;
  }
}

export const reducer = combineReducers({
  authentication: authenticationReducer,
  global: globalReducer,
});

export const store = configureStore({
  reducer,
  preloadedState: typeof window === 'undefined' ? undefined : window.APP_INITIAL_STATE,
});

export type RootState = ReturnType<typeof reducer>;
export type TypeDispatch = typeof store.dispatch;
