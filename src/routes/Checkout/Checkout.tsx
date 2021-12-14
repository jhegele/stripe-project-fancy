import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { layoutUpdateAll } from 'store/slices/layout';
import { useQueries } from 'react-query';
import { getBooks, getCart } from 'api';
import { Col, Row, Button } from 'react-bootstrap';
import { PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';
import { RootState } from 'store';
import { stripeSetPaymentIntent } from 'store/slices/stripe';
import { Loading } from 'components';

const stripePubKey =
  'pk_test_51K2GUfH4qNskFAveMISQL1ozn4cJKrHdE29vOIjAoegCNAWNzzs54fKmEnrmNI2cnJEr6nMv0D63ChRc2NXf9XCm00aMlmOB57';

export const Checkout: React.FC = () => {
  const [formReady, setFormReady] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [
    { isLoading: booksLoading, error: booksError, data: books },
    { isLoading: cartLoading, error: cartError, data: cart },
  ] = useQueries([
    { queryKey: 'books', queryFn: getBooks },
    { queryKey: 'cart', queryFn: getCart },
  ]);
  const {
    stripe: { paymentIntent },
  } = useSelector((state: RootState) => state);
  // memoize the stripe promise to avoid creating new instance on re-render
  const stripePromise = useMemo(() => loadStripe(stripePubKey), [stripePubKey]);

  useEffect(() => {
    dispatch(layoutUpdateAll({ cartDrawer: 'closed', cartLink: 'hidden' }));
  }, []);

  useEffect(() => {
    // Build initial payment intent
    if (!paymentIntent) {
      fetch(`/api/payment`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((pi: PaymentIntent | null) =>
          dispatch(stripeSetPaymentIntent(pi))
        );
    }
    console.log(paymentIntent);
  }, [paymentIntent]);

  useEffect(() => {
    // If we have an existing payment intent and anything changes in carts or
    // books, update the payment intent
    if (paymentIntent && cart && books) {
      const totalPmt = books
        .map((b) => (cart[b.id] ? cart[b.id].quantity * b.amount : 0))
        .reduce((p, c) => p + c, 0);
      if (paymentIntent.amount !== totalPmt) {
        fetch(`/api/payment/${paymentIntent.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentIntent),
        })
          .then((res) => res.json())
          .then((pi: PaymentIntent) => dispatch(stripeSetPaymentIntent(pi)));
      }
    }
  }, [cart, books]);

  if (booksLoading || cartLoading || !paymentIntent) return <Loading />;

  if (booksError || cartError) {
    console.log('cartQuery.error: ', cartError);
    console.log('booksQuery.error: ', booksError);
    return <div>An unexpected error occurred!</div>;
  }

  return (
    <React.Fragment>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntent.client_secret }}
      >
        <div
          style={{
            display: formReady ? 'none' : 'unset',
          }}
        >
          <Loading />
        </div>
        <Row
          className="mt-5"
          style={{
            display: formReady ? 'unset' : 'none',
          }}
        >
          <Col>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    marginBottom: '2rem',
                  }}
                >
                  Total: ${(paymentIntent.amount / 100).toFixed(2)}
                </div>
                <div
                  style={{
                    marginBottom: '2rem',
                  }}
                >
                  <PaymentElement onReady={() => setFormReady(true)} />
                </div>
                <div>
                  <div className="d-grid gap-2">
                    <Button variant="primary">Submit</Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Elements>
    </React.Fragment>
  );
};
