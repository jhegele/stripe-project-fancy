import React, { useEffect, useState } from 'react';
import { Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import { BookCard, Loading } from 'components';
import { useQuery, useQueryClient } from 'react-query';
import { getBooks } from 'api';
import { layoutUpdateCartLink } from 'store/slices/layout';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PaymentIntent } from '@stripe/stripe-js';

export const Home: React.FC = () => {
  /**
   * LOCAL STATE MANAGEMENT
   */
  const [showToast, setShowToast] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );

  /**
   * REACT ROUTER
   */
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  /**
   * REDUX
   */
  const dispatch = useDispatch();

  /**
   * REACT QUERY
   */
  const { isLoading, error, data } = useQuery('books', getBooks, {
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(layoutUpdateCartLink('visible'));
  }, []);

  useEffect(() => {
    const pid = searchParams.get('payment_intent');
    if (pid) {
      fetch(`/api/payment/finalize/${pid}`)
        .then((res) => res.json())
        .then((pi: PaymentIntent) => {
          console.log('PI: ', pi);
          queryClient.invalidateQueries('cart');
          setPaymentIntent(pi);
          if (pi) {
            setShowToast(true);
            navigate('/');
          }
        });
    }
  }, [searchParams]);

  if (isLoading) return <Loading />;

  if (error) return <div>An error occurred!</div>;

  return (
    <React.Fragment>
      <div className="text-center mt-40">
        <h1>Stripe Press Shop</h1>
        <p className="text-secondary">
          Select an item to add to your shopping cart
        </p>
      </div>
      <Row className="mt-40">
        {data.map((book, idx) => (
          <Col key={idx}>
            <BookCard id={idx} {...book} />
          </Col>
        ))}
      </Row>
      {paymentIntent ? (
        <ToastContainer position="top-center">
          <Toast
            bg="success"
            onClose={() => setShowToast(false)}
            show={showToast}
          >
            <Toast.Header>
              <div className="me-auto">Purchase successful!</div>
            </Toast.Header>
            <Toast.Body>
              Congratulations on your purchase! Your card has been charged $
              {(paymentIntent.amount / 100).toFixed(2)}. Thank you for your
              support of Stripe Press.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      ) : null}
    </React.Fragment>
  );
};
