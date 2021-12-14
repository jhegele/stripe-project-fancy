import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartDrawerState = 'open' | 'closed';
export type CartLinkState = 'hidden' | 'visible';

export interface LayoutState {
  cartDrawer: CartDrawerState;
  cartLink: CartLinkState;
}

const initLayout: LayoutState = {
  cartDrawer: 'closed',
  cartLink: 'visible',
};

const sliceLayout = createSlice({
  name: 'layout',
  initialState: initLayout,
  reducers: {
    layoutUpdateCartDrawer: (state, action: PayloadAction<CartDrawerState>) => {
      state.cartDrawer = action.payload;
      return state;
    },
    layoutUpdateCartLink: (state, action: PayloadAction<CartLinkState>) => {
      state.cartLink = action.payload;
      return state;
    },
    layoutUpdateAll: (state, action: PayloadAction<LayoutState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { layoutUpdateCartDrawer, layoutUpdateCartLink, layoutUpdateAll } =
  sliceLayout.actions;

export default sliceLayout.reducer;
