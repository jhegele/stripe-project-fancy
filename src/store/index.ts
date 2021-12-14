import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { logger } from 'redux-logger';

const middleware = [];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: middleware,
});

export type { RootState } from './reducers';
