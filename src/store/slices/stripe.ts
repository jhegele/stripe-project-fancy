import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentIntent } from '@stripe/stripe-js';

export interface StripeState {
  paymentIntent: PaymentIntent | null;
}

const initStripe: StripeState = {
  paymentIntent: null,
};

const sliceStripe = createSlice({
  name: 'stripe',
  initialState: initStripe,
  reducers: {
    stripeSetPaymentIntent: (
      state,
      action: PayloadAction<PaymentIntent | null>
    ) => {
      state.paymentIntent = action.payload;
      return state;
    },
  },
});

export const { stripeSetPaymentIntent } = sliceStripe.actions;

export default sliceStripe.reducer;
