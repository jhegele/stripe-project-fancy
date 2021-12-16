import { Layout, Loading } from 'components';
import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Cart, Checkout, Home } from 'routes';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { useQuery } from 'react-query';
import { getCart } from 'api';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store';
import { stripeSetPaymentIntent } from 'store/slices/stripe';

const stripePubKey =
  'pk_test_51K2GUfH4qNskFAveMISQL1ozn4cJKrHdE29vOIjAoegCNAWNzzs54fKmEnrmNI2cnJEr6nMv0D63ChRc2NXf9XCm00aMlmOB57';

export const App: React.FC = () => {
  const stripePromise = useMemo(() => loadStripe(stripePubKey), [stripePubKey]);
  const { isLoading, error, data: cart } = useQuery('cart', getCart);
  const {
    stripe: { paymentIntent },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart) {
      if (Object.keys(cart).length > 0) {
        fetch(`/api/payment`, {
          method: 'POST',
        })
          .then((res) => res.json())
          .then((pi: PaymentIntent | null) =>
            dispatch(stripeSetPaymentIntent(pi))
          );
      }
    }
  }, [cart]);

  if (isLoading) return <Loading />;

  if (error) {
    console.log('cartError: ', error);
    return <div>An unexpected error occurred!</div>;
  }

  const body = (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

  if (paymentIntent)
    return (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntent.client_secret }}
      >
        {body}
      </Elements>
    );

  return body;
};
