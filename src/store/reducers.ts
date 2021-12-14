import { combineReducers } from '@reduxjs/toolkit';
import layout from './slices/layout';
import stripe from './slices/stripe';

const rootReducer = combineReducers({
  layout,
  stripe,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
