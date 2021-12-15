import React, { useEffect, useState } from 'react';
import { Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import { BookCard } from 'components';
import { useQuery, useQueryClient } from 'react-query';
import { getBooks } from 'api';
import { layoutUpdateCartLink } from 'store/slices/layout';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { PaymentIntent } from '@stripe/stripe-js';

export const Home: React.FC = () => {
  const [showToast, setShowToast] = useState<boolean>(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  const [searchParams, _] = useSearchParams();
  const { isLoading, error, data } = useQuery('books', getBooks, {
    refetchOnWindowFocus: false,
  });
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(layoutUpdateCartLink('visible'));
  }, []);

  useEffect(() => {
    const pid = searchParams.get('pid');
    if (pid) {
      fetch(`/api/payment/finalize/${pid}`)
        .then((res) => res.json())
        .then((pi: PaymentIntent) => {
          console.log('PI: ', pi);
          queryClient.invalidateQueries('cart');
          setPaymentIntent(pi);
          if (pi) {
            setShowToast(true);
          }
        });
    }
  }, [searchParams]);

  if (isLoading) return <div>Loading...</div>;

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
      <ToastContainer position="top-center">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
        >
          <Toast.Header>
            <div className="me-auto">Purchase successful!</div>
          </Toast.Header>
          <Toast.Body>You just bought some books! Congrats!</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};
