import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { layoutUpdateAll } from 'store/slices/layout';
import { useQueries } from 'react-query';
import { getBooks, getCart } from 'api';
import { Col, Row, Button, Spinner } from 'react-bootstrap';
import {
  loadStripe,
  PaymentIntent,
  StripeElements,
  Stripe,
} from '@stripe/stripe-js';
import { RootState } from 'store';
import { stripeSetPaymentIntent } from 'store/slices/stripe';
import { Loading } from 'components';

const stripePubKey =
  'pk_test_51K2GUfH4qNskFAveMISQL1ozn4cJKrHdE29vOIjAoegCNAWNzzs54fKmEnrmNI2cnJEr6nMv0D63ChRc2NXf9XCm00aMlmOB57';

export const Checkout: React.FC = () => {
  /**
   * STATE MANAGEMENT
   */

  // Local
  const [formReady, setFormReady] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const stripe = useRef<Stripe>(null);
  const elements = useRef<StripeElements>(null);
  const pmtForm = useRef();

  // Redux
  const {
    stripe: { paymentIntent },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  // React Query
  const [
    { isLoading: booksLoading, error: booksError, data: books },
    { isLoading: cartLoading, error: cartError, data: cart },
  ] = useQueries([
    { queryKey: 'books', queryFn: getBooks },
    { queryKey: 'cart', queryFn: getCart },
  ]);

  /**
   * EFFECTS HOOKS
   */

  // On initial load, close the cart drawer and hide the cart
  // link. Also need to create a mutable version of the stripe
  // object to persist between renders.
  useEffect(() => {
    dispatch(layoutUpdateAll({ cartDrawer: 'closed', cartLink: 'hidden' }));
    loadStripe(stripePubKey).then((s) => (stripe.current = s));
  }, []);

  // If we have initialized the stripe object, create our payment intent
  useEffect(() => {
    if (stripe.current) {
      fetch(`/api/payment`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((pi: PaymentIntent) => dispatch(stripeSetPaymentIntent(pi)));
    }
  }, [stripe.current]);

  // Once we have a payment intent and our form object has rendered
  // we can safely mount the Stripe payment form. We also create a
  // mutable elements object that can be reused between renders.
  useEffect(() => {
    if (paymentIntent && pmtForm.current) {
      elements.current = stripe.current.elements({
        clientSecret: paymentIntent.client_secret,
      });
      const payment = elements.current.create('payment');
      payment.mount(pmtForm.current);
      payment.on('ready', () => setFormReady(true));
    }
  }, [paymentIntent, pmtForm.current]);

  /**
   * HANDLER FUNCTIONS
   */

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const { error } = await stripe.current.confirmPayment({
      elements: elements.current,
      confirmParams: {
        return_url: `${window.location.protocol}//${window.location.host}`,
      },
    });
    setSubmitLoading(false);
  };

  /**
   * RENDER LOGIC
   */

  // If data is loading or we have no payment intent, show a spinner
  if (booksLoading || cartLoading || !paymentIntent) return <Loading />;

  // If we have any sort of data error, log to the console and
  // inform user
  if (booksError || cartError) {
    console.log('cartQuery.error: ', cartError);
    console.log('booksQuery.error: ', booksError);
    return <div>An unexpected error occurred!</div>;
  }

  return (
    <React.Fragment>
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
                <div id="stripe-pmt-form" ref={pmtForm}></div>
              </div>
              <div>
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};
