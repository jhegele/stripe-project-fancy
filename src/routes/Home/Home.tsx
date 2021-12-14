import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { BookCard } from 'components';
import { useQuery } from 'react-query';
import { getBooks } from 'api';
import { layoutUpdateCartLink } from 'store/slices/layout';
import { useDispatch } from 'react-redux';

export const Home: React.FC = () => {
  const { isLoading, error, data } = useQuery('books', getBooks, {
    refetchOnWindowFocus: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(layoutUpdateCartLink('visible'));
  }, []);

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
    </React.Fragment>
  );
};
